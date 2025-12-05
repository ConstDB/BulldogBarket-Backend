import { Types } from "mongoose";
import { ListingRepository } from "../data/listing.repo";
import { toListingRepsonse } from "../dto/listing.dto";
import { CreateListing } from "../validations/listing";

export const createListingService = async (data: CreateListing, id: Types.ObjectId) => {
  const listing = await ListingRepository.create(data, id);
  return toListingRepsonse(listing);
};
