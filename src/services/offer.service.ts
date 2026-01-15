import mongoose, { Types } from "mongoose";
import { ListingRepository } from "../data/listing.repo";
import { OfferRepository } from "../data/offer.repo";
import { BadRequestError, ConflictError, ForbiddenError, NotFoundError } from "../utils/appError";
import { CreateOffer } from "../validations/offer";
import { OrderService } from "./order.service";
import { getBuyerPendingOffers } from "../controllers/offer.controller";

interface CreateOfferInput extends CreateOffer {
  buyerId: string;
}

export const OfferService = {
  createOffer: async (data: CreateOfferInput) => {
    const { buyerId, listingId, buyerNote, meetupLocation } = data;
    const listing = await ListingRepository.findById(listingId);
    const existingOffer = await OfferRepository.findOne({
      listing: listingId,
      buyer: buyerId,
      status: "pending",
    });

    if (!listing) {
      throw new NotFoundError("Listing item not found.");
    }
    if (existingOffer) {
      throw new ConflictError("You already have a pending offer for this listing.");
    }
    if (listing.type !== "single") {
      throw new BadRequestError("This endpoint is only for single type listings.");
    }
    if (listing.seller.toString() === buyerId) {
      throw new ForbiddenError("You cannot request your own item.");
    }
    if (listing.status === "reserved") {
      throw new ConflictError("Listing is already reserved.");
    }
    if (listing.status !== "available") {
      throw new ConflictError("Listing is not available for purchase.");
    }

    const offerData = {
      listingId,
      meetupLocation,
      buyerNote,
      buyer: buyerId,
    };

    return OfferRepository.create(offerData);
  },

  buyerCancelOffer: async (offerId: string, userId: string) => {
    const offer = await OfferRepository.findById(offerId);

    if (!offer) {
      throw new NotFoundError("Offer not found.");
    }

    if (offer.buyer.toString() !== userId) {
      throw new ForbiddenError("Only the user who requested can cancel this offer.");
    }

    if (offer.status !== "pending") {
      throw new ConflictError("Only pending offers can be cancelled.");
    }

    const updatedOffer = await OfferRepository.cancelOffer(offerId);

    if (!updatedOffer) {
      throw new NotFoundError("Offer ");
    }

    return updatedOffer;
  },

  rejectOffer: async (offerId: string, userId: string) => {
    const offer = await OfferRepository.findById(offerId);

    if (!offer) {
      throw new NotFoundError("Offer not found.");
    }

    if (offer.status !== "pending") {
      throw new ConflictError("You can only reject pending orders.");
    }

    const listingId = offer.listing.toString();
    const listing = await ListingRepository.findById(listingId);

    if (!listing) {
      throw new NotFoundError("Listing not found.");
    }

    if (listing.seller.toString() !== userId) {
      throw new ForbiddenError("Only sellers are allowed to reject an offer.");
    }

    const updatedOffer = await OfferRepository.rejectOffer(offerId);

    if (!updatedOffer) {
      throw new NotFoundError("Offer not found during status update.");
    }

    return updatedOffer;
  },

  approveOffer: async (offerId: string, userId: string) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const offer = await OfferRepository.findById(offerId, session);

      if (!offer) {
        throw new NotFoundError("Offer not found.");
      }

      if (offer.status !== "pending") {
        throw new ConflictError("You can only approve pending orders.");
      }

      const listingId = offer.listing.toString();
      const listing = await ListingRepository.findById(listingId, session);

      if (!listing) {
        throw new NotFoundError("Listing not found.");
      }

      if (listing.status !== "available") {
        throw new ConflictError("Listing is not available for purchase.");
      }

      if (listing.seller.toString() !== userId) {
        throw new ForbiddenError("Only sellers are allowed to approve offers.");
      }

      const updatedOffer = await OfferRepository.approveOffer(offerId, session);

      if (!updatedOffer) {
        throw new NotFoundError("Offer not found during status update.");
      }

      const order = await OrderService.createOrder({
        listingId,
        quantity: 1,
        meetupLocation: offer.buyerNote,
        paymentMethod: "Cash on Meetup",
        buyerId: offer.buyer.toString(),
      });

      if (!order) {
        throw new NotFoundError("Order creation failed.");
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

  getSellerPendingOffers: async (sellerId: string) => {
    const listingIds = await ListingRepository.findIdsBySeller(sellerId);

    if (listingIds.length === 0) return [];

    const pendingOffers = await OfferRepository.getSellerOffers(listingIds);
    return pendingOffers;
  },

  getBuyerPendingOffers: async (buyerId: Types.ObjectId) => {
    if (!Types.ObjectId.isValid(buyerId)) {
      throw new BadRequestError("Invalid buyer ID.");
    }

    const pendingOffers = await OfferRepository.getBuyerOffers(buyerId);
    return pendingOffers;
  },
};
