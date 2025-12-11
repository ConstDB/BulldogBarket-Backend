import mongoose, { ClientSession } from "mongoose";
import { OrderModel } from "../models/order.model";
import { OrderDoc } from "../types/orderDoc";
import { CreateOrder } from "../validations/order";
import { ListingModel } from "../models/listing.model";
import { NotFoundError } from "../utils/appError";
import { UserModel } from "../models/user.model";

export interface CreateOrderData extends CreateOrder {
  totalPrice: number;
  buyer: string;
}

export const OrderRepository = {
  findById: async (id: string, session?: ClientSession): Promise<OrderDoc | null> => {
    return await OrderModel.findById(id).session(session ?? null);
  },

  create: async (data: CreateOrderData, session: mongoose.ClientSession): Promise<OrderDoc> => {
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
        { $inc: { stocks: quantity }, ...(quantity > 0 && { status: "available" }) },
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
  },
};
