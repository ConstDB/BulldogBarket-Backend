import { Types } from "mongoose";
import { ListingRepository } from "../data/listing.repo";
import { toListingRepsonse } from "../dto/listing.dto";
import { CreateListing, ListingQuery } from "../validations/listing";

export const ListingService = {
  // TODO: Refactor this create listing, add checks to ensure that the user is creating a valid listing
  createListing: async (data: CreateListing, id: Types.ObjectId) => {
    const listing = await ListingRepository.create(data, id);
    return toListingRepsonse(listing);
  },

  getListingsFeed: async (data: ListingQuery) => {
    return ListingRepository.getFeed(data);
  },

  upvote: async (userId: Types.ObjectId, listingId: Types.ObjectId) => {
    const upvotes = await ListingRepository.upvote(userId, listingId);
    return upvotes;
  },

  downvote: async (userId: Types.ObjectId, listingId: Types.ObjectId) => {
    const downvotes = await ListingRepository.downvote(userId, listingId);
    return downvotes;
  },
};
