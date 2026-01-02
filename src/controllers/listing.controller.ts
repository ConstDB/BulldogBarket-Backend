import { Request, Response } from "express";
import { Types } from "mongoose";
import { toSellerActiveListings } from "../dto/listing.dto";
import { ListingService } from "../services/listing.service";
import { asyncHandler } from "../utils/asyncHandlers";
import { ListingQuery } from "../validations/listing";

export const createListing = asyncHandler(async (req: Request, res: Response) => {
  const listing = await ListingService.createListing(req.body, req.user._id);
  res.status(201).json({ ...listing });
});

export const getListingFeed = asyncHandler(async (req: Request, res: Response) => {
  const query = req.validatedQuery as ListingQuery;

  const feed = await ListingService.getListingsFeed({
    page: query.page,
    limit: query.limit,
    sort: query.sort,
  });

  res.status(200).json(feed);
});

export const upvotes = asyncHandler(async (req: Request, res: Response) => {
  const listing = new Types.ObjectId(req.params.id);

  if (!listing) {
    return res.status(400).json({ message: "Failed to upvote." });
  }

  await ListingService.upvote(req.user._id, listing);
  return res.sendStatus(204);
});

export const downvotes = asyncHandler(async (req: Request, res: Response) => {
  const listing = new Types.ObjectId(req.params.id);

  if (!listing) {
    return res.status(400).json({ message: "Failed to downvote." });
  }

  await ListingService.downvote(req.user._id, listing);
  return res.sendStatus(204);
});

export const getSellerActiveListings = asyncHandler(async (req: Request, res: Response) => {
  const sellerId = req.user._id.toString();
  const activeListings = await ListingService.getActiveListings(sellerId);

  res.status(200).json(toSellerActiveListings(activeListings));
});
