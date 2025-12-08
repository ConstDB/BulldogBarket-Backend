import { ListingRepository } from "../data/listing.repo";
import { OfferRepository } from "../data/offer.repo";
import { BadRequestError, ConflictError, ForbiddenError, NotFoundError } from "../utils/appError";
import { CreateOffer } from "../validations/offer";

interface CreateOfferInput extends CreateOffer {
  buyerId: string;
}

export const createOfferService = async (data: CreateOfferInput) => {
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
};
