import { Types } from "mongoose";
import { ListingRepository } from "../data/listing.repo";
import { toListingRepsonse } from "../dto/listing.dto";
import { CreateListing, ListingQuery } from "../validations/listing";

export const createListingService = async (data: CreateListing, id: Types.ObjectId) => {
  const listing = await ListingRepository.create(data, id);
  return toListingRepsonse(listing);
};

export const getListingsFeedService = async (data: ListingQuery) => {
  return ListingRepository.getFeed(data);
};
