import mongoose, { ClientSession, Types } from "mongoose";
import { ListingModel } from "../models/listing.model";
import { OrderModel } from "../models/order.model";
import { UserModel } from "../models/user.model";
import { OrderDoc } from "../types/orderDoc";
import { NotFoundError } from "../utils/appError";
import { CreateOrder } from "../validations/order";
import { ListingRepository } from "./listing.repo";

export interface CreateOrderData extends CreateOrder {
  totalPrice: number;
  buyer: string;
}

export const OrderRepository = {
  findById: async (id: string, session?: ClientSession): Promise<OrderDoc | null> => {
    return await OrderModel.findById(id).session(session ?? null);
  },

  create: async (
    data: CreateOrderData,
    session: mongoose.ClientSession
  ): Promise<OrderDoc> => {
    const order = new OrderModel({
      listing: data.listingId,
      buyer: data.buyer,
      quantity: data.quantity,
      totalPrice: data.totalPrice,
      meetupLocation: data.meetupLocation,
      paymentMethod: data.paymentMethod,
    });

    await order.save({ session });
    return order;
  },

  markBuyerConfirmed: async (order: OrderDoc, session: ClientSession) => {
    order.buyerConfirmed = true;
    await order.save({ session });
    return order;
  },

  markSellerConfirmed: async (order: OrderDoc, session: ClientSession) => {
    order.sellerConfirmed = true;
    await order.save({ session });
    return order;
  },

  buyerCancelOrder: async (orderId: string, listingId: string, quantity: number) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const order = await OrderModel.findByIdAndUpdate(
        orderId,
        { status: "cancelled" },
        { new: true, session }
      );

      if (!order) {
        throw new NotFoundError("Order not found during cancellation.");
      }

      const listing = await ListingModel.findByIdAndUpdate(
        listingId,
        {
          $inc: { stocks: quantity },
          ...(quantity > 0 && { status: "available" }),
        },
        { new: true, session }
      );

      if (!listing) {
        throw new NotFoundError("Listing not found during stock restoration.");
      }

      await session.commitTransaction();
      return order;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  },

  sellerCancelOrder: async (
    orderId: string,
    listingId: string,
    quantity: number,
    cancelReason: string
  ) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const order = await OrderModel.findByIdAndUpdate(
        orderId,
        { status: "cancelled", cancelReason },
        { new: true, session }
      );

      if (!order) {
        throw new NotFoundError("Order not found during cancellation.");
      }

      const listing = await ListingModel.findByIdAndUpdate(
        listingId,
        {
          $inc: { stocks: quantity },
          ...(quantity > 0 && { status: "available" }),
        },
        { new: true, session }
      );

      if (!listing) {
        throw new NotFoundError("Listing not found during stock restoration.");
      }

      await session.commitTransaction();
      return order;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  },

  settleOrder: async (orderId: string, session: ClientSession) => {
    const order = await OrderModel.findByIdAndUpdate(
      orderId,
      {
        status: "completed",
        settledAt: new Date(),
      },
      { new: true, session }
    );

    if (!order) {
      throw new NotFoundError("Order not found during status update.");
    }

    const listingId = order.listing;
    const listing = await ListingModel.findById(listingId).session(session);

    if (!listing) {
      throw new NotFoundError("Listing not found during finalization of order.");
    }

    const sellerId = listing.seller;

    await UserModel.findByIdAndUpdate(
      sellerId,
      {
        $inc: { totalEarnings: order.totalPrice },
      },
      { new: true, session }
    );

    return order;
  },

  getTotalPendingOrders: async (sellerId: string) => {
    const listingIds = await ListingRepository.findIdsBySeller(sellerId);

    if (listingIds.length === 0) return 0;

    const totalPendingOrders = await OrderModel.countDocuments({
      listing: { $in: listingIds },
      status: "pending",
    });

    return totalPendingOrders;
  },

  getPendingOrders: async (sellerId: string) => {
    const listingIds = await ListingRepository.findIdsBySeller(sellerId);

    if (listingIds.length === 0) return [];

    const pendingOrders = await OrderModel.find({
      listing: { $in: listingIds },
      status: "pending",
    })
      .select("_id listing quantity totalPrice paymentMethod")
      .populate([
        { path: "listing", select: "name" },
        { path: "buyer", select: "name avatarUrl" },
      ])
      .sort({ createdAt: -1 })
      .lean();

    return pendingOrders;
  },

  getBuyersOrder: async (buyerId: string, status: string) => {
    const query: any = { buyer: buyerId, status };

    const orders = await OrderModel.find(query)
      .select("_id listing quantity totalPrice paymentMethod status cancelReason")
      .populate([
        {
          path: "listing",
          select: "name images type seller",
          populate: {
            path: "seller",
            select: "name socials.messengerLink",
          },
        },
      ])
      .sort({ createdAt: -1 })
      .lean();

    return orders;
  },
};
