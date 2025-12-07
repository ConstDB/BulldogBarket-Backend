import { Types } from "mongoose";
import { ListingModel } from "../models/listing.model";
import { ListingDoc } from "../types/listingDoc";
import { CreateListing, ListingQuery } from "../validations/listing";

export const ListingRepository = {
  create: async (data: CreateListing, sellerId: Types.ObjectId): Promise<ListingDoc> => {
    const listing = await ListingModel.create({ ...data, seller: sellerId, upvotes: [], comments: [] });
    return listing;
  },

  getFeed: async (options: ListingQuery) => {
    const { page, limit, sort } = options;
    const query: any = {};

    let sortOptions: any = { createdAt: -1 };

    if (sort === "popular") sortOptions = { upvotes: -1, createdAt: -1 };

    const listings = await ListingModel.find(query)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("seller", "name avatarUrl yearLevel course campus socials.messengerLink");

    return listings;
  },

  insertUpvote: async (userId: Types.ObjectId, listingId: Types.ObjectId) => {
    const upvotes = await ListingModel.updateOne(
      { _id: new Types.ObjectId(listingId)},
      { $addToSet: { upvotes : new Types.ObjectId(userId)}}
    )
    return upvotes;
  }
};
