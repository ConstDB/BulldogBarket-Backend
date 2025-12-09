import { Types } from "mongoose";
import { SavedListingRepository } from "../data/saves.repo";


export const createSavedListingService = async( buyerId: Types.ObjectId, listingId: Types.ObjectId) => {
    const savedListing = await SavedListingRepository.create(buyerId, listingId);
    return savedListing;
}

export const getSavedListingService = async( buyerId: Types.ObjectId) => {
    const savedListings = await SavedListingRepository.findById(buyerId);
    return savedListings;
}