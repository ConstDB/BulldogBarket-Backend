import { Request, Response } from "express";
import { createListingService } from "../services/listing.service";
import { asyncHandler } from "../utils/asyncHandlers";

export const createListing = asyncHandler(async (req: Request, res: Response) => {
  const listing = await createListingService(req.body, req.user._id);
  res.status(201).json({ ...listing });
});
