import { Types } from "mongoose";
import { ListingModel, ListingSchema } from "../models/listing.model";
import { ListingDoc } from "../types/listingDoc";
import { CreateListing, ListingQuery } from "../validations/listing";
import { BadRequestError, ConflictError, NotFoundError } from "../utils/appError";

export const ListingRepository = {
  create: async (data: CreateListing, sellerId: Types.ObjectId): Promise<ListingDoc> => {
    const listing = await ListingModel.create({ ...data, seller: sellerId, upvotes: [], comments: [] });
    return listing;
  },

  findById: async (id: string, session?: any) => {
    return ListingModel.findById(id).session(session);
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

  decrementStock: async (listing: ListingDoc, quantity: number, session?: any): Promise<ListingDoc> => {
    if (quantity <= 0) {
      throw new BadRequestError("Quantity must be greater than 0");
    }

    const updatedListing = await ListingModel.findOneAndUpdate(
      { _id: listing._id, stocks: { $gte: quantity } },
      [
        {
          $set: {
            stocks: { $subtract: ["$stocks", quantity] },
            status: {
              $cond: [{ $eq: [{ $subtract: ["$stocks", quantity] }, 0] }, "sold", "$status"],
            },
          },
        },
      ],
      { new: true, updatePipeline: true, session }
    );

    if (!updatedListing) {
      throw new ConflictError("Not enough stock for this listing");
    }

    return updatedListing;
  },

  upvote: async (userId: Types.ObjectId, listingId: Types.ObjectId) => {
    const upvotes = await ListingModel.updateOne(
      { _id: new Types.ObjectId(listingId) },
      { $addToSet: { upvotes: new Types.ObjectId(userId) } }
    );
    return upvotes;
  },

  downvote: async (userId: Types.ObjectId, listingId: Types.ObjectId) => {
    const downvotes = await ListingModel.updateOne({ _id: new Types.ObjectId(listingId) }, { $pull: { upvotes: userId } });

    return downvotes;
  },

  addCommentToListing: async (listingId: string, userId: string, message: string) => {
    const updatedListing = await ListingModel.findByIdAndUpdate(
      listingId,
      {
        $push: {
          comments: {
            user: userId,
            message,
            createdAt: new Date(),
          },
        },
      },
      { new: true }
    )
      .populate({
        path: "comments.user",
        select: "name studentNumber course yearLevel campus avatarUrl",
      })
      .select({ comments: { $slice: -1 } });

    if (!updatedListing || !updatedListing.comments[0]) {
      return null;
    }

    return updatedListing.comments[0];
  },

  getComments: async (listingId: string) => {
    const listing = await ListingModel.findById(listingId)
      .select("comments")
      .populate("comments.user", "name studentNumber course yearLevel campus avatarUrl");

    return listing?.comments;
  },

  deleteCommentFromListing: async (listingId: string, commentId: string, userId: string) => {
    const updatedListing = await ListingModel.findOneAndUpdate(
      { _id: listingId, "comments._id": commentId, "comments.user": userId },
      { $pull: { comments: { _id: commentId } } },
      { new: true }
    );

    if (!updatedListing) {
      throw new NotFoundError("Comment not found or you are not authorized to delete it.");
    }
  },
};
