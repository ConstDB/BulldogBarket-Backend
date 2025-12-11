import { Request, Response } from "express";
import { toOfferResponse } from "../dto/offer.dto";
import { OfferService } from "../services/offer.service";
import { asyncHandler } from "../utils/asyncHandlers";

export const createOffer = asyncHandler(async (req: Request, res: Response) => {
  const buyerId = req.user._id;
  const { listingId, meetupLocation, buyerNote } = req.body;

  const offer = await OfferService.createOffer({
    buyerId: buyerId.toString(),
    listingId,
    buyerNote,
    meetupLocation,
  });

  res.status(201).json(toOfferResponse(offer));
});

export const buyerCancelOffer = asyncHandler(async (req: Request, res: Response) => {
  const { offerId } = req.validatedParams;
  const buyerId = req.user._id.toString();

  const offer = await OfferService.buyerCancelOffer(offerId, buyerId);
  res.status(200).json(toOfferResponse(offer));
});
