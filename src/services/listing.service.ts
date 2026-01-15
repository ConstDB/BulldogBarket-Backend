import { Types } from "mongoose";
import { ListingRepository } from "../data/listing.repo";
import { toListingRepsonse } from "../dto/listing.dto";
import { CreateListing, ListingQuery } from "../validations/listing";
import { BadRequestError } from "../utils/appError";

export const ListingService = {
  // TODO: Refactor this create listing, add checks to ensure that the user is creating a valid listing
  createListing: async (data: CreateListing, id: Types.ObjectId) => {
    const listing = await ListingRepository.create(data, id);
    return toListingRepsonse(listing);
  },

  getListingsFeed: async (data: ListingQuery, userId: Types.ObjectId) => {
    return ListingRepository.getFeed(data, userId);
  },

  upvote: async (userId: Types.ObjectId, listingId: Types.ObjectId) => {
    const upvotes = await ListingRepository.upvote(userId, listingId);
    return upvotes;
  },

  downvote: async (userId: Types.ObjectId, listingId: Types.ObjectId) => {
    const downvotes = await ListingRepository.downvote(userId, listingId);
    return downvotes;
  },

  getActiveListings: async (sellerId: string) => {
    const ACTIVE_STATUSES = ["available", "reserved"];

    if (!sellerId) {
      throw new BadRequestError("Missing seller ID");
    }

    const activeListings = await ListingRepository.getActiveListings(sellerId, ACTIVE_STATUSES);
    return activeListings;
  },
};
