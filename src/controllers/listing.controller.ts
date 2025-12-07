import { Request, Response } from "express";
import { toListingFeedResponse } from "../dto/listing.dto";
import { createListingService, getListingsFeedService } from "../services/listing.service";
import { asyncHandler } from "../utils/asyncHandlers";

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
