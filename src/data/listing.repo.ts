import { Types } from "mongoose";
import { ListingModel } from "../models/listing.model";
import { ListingDoc } from "../types/listingDoc";
import { CreateListing } from "../validations/listing";

export const ListingRepository = {
  create: async (data: CreateListing, sellerId: Types.ObjectId): Promise<ListingDoc> => {
    const listing = await ListingModel.create({ ...data, seller: sellerId, upvotes: [], comments: [] });
    return listing;
  },
};
