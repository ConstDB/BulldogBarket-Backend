import { Request, Response } from "express";
import { toOfferResponse, toPendingSellerOffersResponse } from "../dto/offer.dto";
import { toOrderResponse } from "../dto/order.dto";
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

export const rejectOffer = asyncHandler(async (req: Request, res: Response) => {
  const { offerId } = req.validatedParams;
  const userId = req.user._id.toString();

  const offer = await OfferService.rejectOffer(offerId, userId);
  res.status(200).json(toOfferResponse(offer));
});

export const approveOffer = asyncHandler(async (req: Request, res: Response) => {
  const { offerId } = req.validatedParams;
  const userId = req.user._id.toString();

  const order = await OfferService.approveOffer(offerId, userId);
  res.status(200).json(toOrderResponse(order));
});

export const getSellerPendingOffers = asyncHandler(
  async (req: Request, res: Response) => {
    const sellerId = req.user._id.toString();
    const pendingOffers = await OfferService.getSellerPendingOffers(sellerId);

    res.status(200).json(toPendingSellerOffersResponse(pendingOffers));
  }
);
