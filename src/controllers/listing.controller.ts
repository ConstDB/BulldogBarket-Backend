import { Request, Response } from "express";
import { toListingFeedResponse } from "../dto/listing.dto";
import { createListingService, getListingsFeedService, upvotesService } from "../services/listing.service";
import { asyncHandler } from "../utils/asyncHandlers";
import { Types } from "mongoose";

export const createListing = asyncHandler(async (req: Request, res: Response) => {
  const listing = await createListingService(req.body, req.user._id);
  res.status(201).json({ ...listing });
});

export const getListingFeed = asyncHandler(async (req: Request, res: Response) => {
  const query = req.validatedQuery;

  const feed = await getListingsFeedService({
    page: query.page,
    limit: query.limit,
    sort: query.sort,
  });

  res.status(200).json(toListingFeedResponse(feed));
});

export const upvotes = asyncHandler(async (req: Request, res: Response) => {
  const listing = req.params.id

  if (!listing) {
    return res.status(400).json({ message: "Failed to upvote." });
  }
  
  const upvote = await upvotesService(new Types.ObjectId(req.user._id), new Types.ObjectId(listing))
  return res.sendStatus(204);
})