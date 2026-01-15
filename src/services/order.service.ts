import mongoose, { ClientSession } from "mongoose";
import { ListingRepository } from "../data/listing.repo";
import { CreateOrderData, OrderRepository } from "../data/order.repo";
import { BadRequestError, ConflictError, ForbiddenError, NotFoundError } from "../utils/appError";
import { CreateOrder } from "../validations/order";

interface CreateOrderInput extends CreateOrder {
  buyerId: string;
}

export const OrderService = {
  createOrder: async (data: CreateOrderInput, session?: ClientSession) => {
    const ownSession = !session;
    const s = session ?? (await mongoose.startSession());

    if (ownSession) s.startTransaction();

    try {
      const { listingId, meetupLocation, paymentMethod, quantity, buyerId } = data;
      const listing = await ListingRepository.findById(listingId, session);

      if (!listing) {
        throw new NotFoundError("Listing item not found.");
      }

      if (listing.seller.toString() === buyerId) {
        throw new ForbiddenError("You cannot buy your own item.");
      }

      if (listing.status !== "available") {
        throw new ConflictError("Listing is not available for purchase.");
      }

      if (listing.stocks < quantity) {
        throw new ConflictError(`Not enough stocks. Only ${listing.stocks} left.`);
      }

      const updatedListing = await ListingRepository.decrementStock(listing, quantity, session);
      const totalPrice = updatedListing.price * quantity;
      const orderData: CreateOrderData = {
        listingId,
        quantity,
        meetupLocation,
        paymentMethod,
        totalPrice,
        buyer: buyerId,
      };
      const order = await OrderRepository.create(orderData, s);

      if (ownSession) await s.commitTransaction();
      return order;
    } catch (error) {
      if (ownSession) await s.abortTransaction();
      throw error;
    } finally {
      if (ownSession) await s.endSession();
    }
  },

  buyerCancelOrder: async (orderId: string, buyerId: string) => {
    const order = await OrderRepository.findById(orderId);

    if (!order) {
      throw new NotFoundError("Order not found.");
    }

    if (order.sellerConfirmed) {
      throw new ConflictError(
        "You cannot cancel the order because the seller already marked it as completed."
      );
    }

    if (order.buyer.toString() !== buyerId) {
      throw new ForbiddenError("You cannot cancel someone else's order.");
    }

    if (order.status !== "pending") {
      throw new ConflictError("Only pending orders can be cancelled.");
    }

    const listingId = order.listing.toString();
    const quantity = order.quantity;

    return await OrderRepository.buyerCancelOrder(orderId, listingId, quantity);
  },

  sellerCancelOrder: async (orderId: string, sellerId: string, cancelReason: string) => {
    const order = await OrderRepository.findById(orderId);

    if (!order) {
      throw new NotFoundError("Order not found.");
    }

    const listing = await ListingRepository.findById(order.listing.toString());

    if (!listing) {
      throw new NotFoundError("Listing not found.");
    }

    if (listing.seller.toString() !== sellerId) {
      throw new ForbiddenError("You are not the seller of this listing.");
    }

    if (order.status !== "pending") {
      throw new BadRequestError("Only pending orders can be cancelled.");
    }

    const listingId = order.listing.toString();
    const quantity = order.quantity;

    return await OrderRepository.sellerCancelOrder(orderId, listingId, quantity, cancelReason);
  },

  buyerConfirm: async (orderId: string, buyerId: string) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const order = await OrderRepository.findById(orderId, session);

      if (!order) {
        throw new NotFoundError("Order not found.");
      }

      if (order.buyer.toString() !== buyerId) {
        throw new ForbiddenError("Only the buyer can perform this action.");
      }

      if (order.status !== "pending") {
        throw new ConflictError("Only pending orders can be marked as completed.");
      }

      if (order.buyerConfirmed === true) {
        throw new ConflictError("You already marked this order as completed.");
      }

      await OrderRepository.markBuyerConfirmed(order, session);

      if (order.sellerConfirmed && order.buyerConfirmed) {
        await OrderRepository.settleOrder(orderId, session);
      }

      await session.commitTransaction();
      return order;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  },

  sellerConfirm: async (orderId: string, sellerId: string) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const order = await OrderRepository.findById(orderId, session);

      if (!order) {
        throw new NotFoundError("Order not found.");
      }

      if (order.status !== "pending") {
        throw new ConflictError("Only pending orders can be marked as completed.");
      }

      if (order.sellerConfirmed === true) {
        throw new ConflictError("You already marked this order as completed.");
      }

      const listingId = order.listing.toString();
      const listing = await ListingRepository.findById(listingId, session);

      if (!listing) {
        throw new NotFoundError("Listing not found.");
      }

      if (listing.seller.toString() !== sellerId) {
        throw new ForbiddenError("Only the seller can mark this order as completed.");
      }

      await OrderRepository.markSellerConfirmed(order, session);

      if (order.sellerConfirmed && order.buyerConfirmed) {
        await OrderRepository.settleOrder(orderId, session);
      }

      await session.commitTransaction();
      return order;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  },

  getSellerPendingOrders: async (sellerId: string) => {
    const pendingOrders = await OrderRepository.getPendingOrders(sellerId);

    return pendingOrders;
  },

  getBuyerOrders: async (buyerId: string, status: string) => {
    const validOrderStatuses = ["pending", "cancelled", "completed"];

    if (!status) {
      throw new BadRequestError("Missing order status.");
    }

    if (!validOrderStatuses.includes(status)) {
      throw new BadRequestError("Invalid order status.");
    }

    return await OrderRepository.getBuyersOrder(buyerId, status);
  },
};
