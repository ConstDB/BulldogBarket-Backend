import { ClientSession, Types } from "mongoose";
import { ListingModel } from "../models/listing.model";
import { ListingDoc } from "../types/listingDoc";
import { BadRequestError, ConflictError, NotFoundError } from "../utils/appError";
import { CreateListing, ListingQuery } from "../validations/listing";

export const ListingRepository = {
  create: async (data: CreateListing, sellerId: Types.ObjectId): Promise<ListingDoc> => {
    const listing = await ListingModel.create({
      ...data,
      seller: sellerId,
      upvotes: [],
      comments: [],
    });
    return listing;
  },

  findById: async (id: string, session?: ClientSession): Promise<ListingDoc | null> => {
    return ListingModel.findById(id).session(session ?? null);
  },

  findIdsBySeller: async (sellerId: string) => {
    return ListingModel.find({ seller: sellerId }).distinct("_id");
  },

  getActiveListings: async (sellerId: string, activeStatuses: string[]) => {
    const activeListings = await ListingModel.find({
      seller: sellerId,
      status: { $in: activeStatuses },
    })
      .select("_id images name status stocks")
      .sort({ createdAt: -1 })
      .lean();

    return activeListings;
  },

  getFeed: async (options: ListingQuery, userId: Types.ObjectId) => {
    const { page, limit, sort } = options;
    const skip = (page - 1) * limit;
    const pipeline: any[] = [];

    if (sort === "popular") {
      pipeline.push({ $sort: { upvotesCount: -1, createdAt: -1 } });
    } else {
      pipeline.push({ $sort: { createdAt: -1 } });
    }

    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit });
    pipeline.push(
      {
        $lookup: {
          from: "users",
          localField: "seller",
          foreignField: "_id",
          as: "seller",
        },
      },
      { $unwind: "$seller" }
    );

    pipeline.push({
      $lookup: {
        from: "offers",
        let: { listingId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [{ $eq: ["$listing", "$$listingId"] }, { $eq: ["$buyer", userId] }],
              },
            },
          },
          { $limit: 1 },
        ],
        as: "userOffer",
      },
    });

    pipeline.push({
      $lookup: {
        from: "orders",
        let: { listingId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [{ $eq: ["$listing", "$$listingId"] }, { $eq: ["$buyer", userId] }],
              },
            },
          },
          { $limit: 1 },
        ],
        as: "userOrder",
      },
    });

    pipeline.push({
      $addFields: {
        upvotesCount: { $size: { $ifNull: ["$upvotes", []] } },
        commentsCount: { $size: { $ifNull: ["$comments", []] } },
        userHasInteracted: {
          $cond: {
            if: { $eq: ["$type", "single"] },
            then: { $gt: [{ $size: "$userOffer" }, 0] },
            else: { $gt: [{ $size: "$userOrder" }, 0] },
          },
        },
      },
    });

    pipeline.push({
      $project: {
        userOffer: 0,
        userOrder: 0,
      },
    });

    pipeline.push({
      $project: {
        _id: 1,
        type: 1,
        name: 1,
        images: 1,
        price: 1,
        category: 1,
        description: 1,
        stocks: 1,
        condition: 1,
        createdAt: 1,
        upvotesCount: 1,
        commentsCount: 1,
        userHasInteracted: 1,
        seller: {
          id: "$seller._id",
          name: "$seller.name",
          avatarUrl: "$seller.avatarUrl",
          yearLevel: "$seller.yearLevel",
          course: "$seller.course",
          campus: "$seller.campus",
          messengerLink: "$seller.socials.messengerLink",
        },
      },
    });

    const listings = await ListingModel.aggregate(pipeline);
    return listings;
  },

  decrementStock: async (
    listing: ListingDoc,
    quantity: number,
    session?: ClientSession
  ): Promise<ListingDoc> => {
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
      { new: true, updatePipeline: true, session: session ?? null }
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
    const downvotes = await ListingModel.updateOne(
      { _id: new Types.ObjectId(listingId) },
      { $pull: { upvotes: userId }, $push: { downvotes: userId } }
    );

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

  editComment: async (listingId: string, commentId: string, userId: string, message: string) => {
    const listing = await ListingModel.findOne({
      _id: listingId,
      "comments._id": commentId,
      "comments.user": userId,
    }).populate({
      path: "comments.user",
      select: "name studentNumber course yearLevel campus avatarUrl",
    });

    if (!listing) {
      throw new NotFoundError("Listing not found or you are not authorized to edit the comment.");
    }

    const comment = listing.comments.id(commentId);

    if (!comment) {
      throw new NotFoundError("Comment not found.");
    }

    comment.message = message;

    await listing.save();

    return comment;
  },

  deleteComment: async (listingId: string, commentId: string, userId: string) => {
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
