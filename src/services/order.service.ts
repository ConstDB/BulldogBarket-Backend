import mongoose from "mongoose";
import { ListingRepository } from "../data/listing.repo";
import { CreateOrderData, OrderRepository } from "../data/order.repo";
import { BadRequestError, ConflictError, ForbiddenError, NotFoundError } from "../utils/appError";
import { CreateOrder } from "../validations/order";

interface CreateOrderInput extends CreateOrder {
  buyerId: string;
}

export const createOrderService = async (data: CreateOrderInput) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { listingId, meetupLocation, paymentMethod, quantity, buyerId } = data;
    const listing = await ListingRepository.findById(listingId, session);

    if (!listing) {
      throw new NotFoundError("Listing item not found.");
    }
    if (listing.type !== "bulk") {
      throw new BadRequestError("This endpoint is only for bulk orders.");
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
    const order = await OrderRepository.create(orderData, session);

    await session.commitTransaction();
    session.endSession();

    return order;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
