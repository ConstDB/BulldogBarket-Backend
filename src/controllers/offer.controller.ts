import { Request, Response } from "express";
import { toOfferResponse } from "../dto/offer.dto";
import { createOfferService } from "../services/offer.service";
import { asyncHandler } from "../utils/asyncHandlers";

export const createOffer = asyncHandler(async (req: Request, res: Response) => {
  const buyerId = req.user._id;
  const { listingId, meetupLocation, buyerNote } = req.body;

  const offer = await createOfferService({
    buyerId: buyerId.toString(),
    listingId,
    buyerNote,
    meetupLocation,
  });

  res.status(201).json(toOfferResponse(offer));
});
