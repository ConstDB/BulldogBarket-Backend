import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandlers";
import { createSavedListingService, deleteSavedListingService, getSavedListingService } from "../services/saves.service";
import { toSavedListingResponse } from "../dto/saves.dto";

export const createSavedListing = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const buyerId = req.user._id;
    const {listingId} = req.body;

    try{
        await createSavedListingService(buyerId, listingId)
        return res.sendStatus(204)
    } catch (err) {
        next(err)
    }
});

export const getSavedListing = asyncHandler(async (req: Request, res: Response) => {
    const savedListing = await getSavedListingService(req.user._id)
    return res.status(201).json(toSavedListingResponse(savedListing));
});

export const deleteSavedListing = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const buyerId = req.user._id;
    const {listingId} = req.body;

    try {
        await deleteSavedListingService(buyerId, listingId);
        return res.sendStatus(204);
    } catch(err) {
        next(err);
    }
});