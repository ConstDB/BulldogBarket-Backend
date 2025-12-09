import { Types } from "mongoose";
import { SavedListingDoc } from "../types/savesDoc";
import { SavedListingModel } from "../models/saves.model";


export const SavedListingRepository = {
    create: async(buyerId: Types.ObjectId, listingId: Types.ObjectId) => {
        const savedListing = await SavedListingModel.create({ buyer: buyerId, listing: listingId})
        return savedListing;
    },

    findById: async(buyerId: Types.ObjectId) => {
        const savedListing = await SavedListingModel.find(
            {buyer:buyerId})
                .populate({
                    path: "listing",
                    select: "seller name type images price category stocks status condition",
                        populate: {
                            path: "seller",
                            select: "name"
                        }
                    })
                    .lean<SavedListingDoc[]>();
        return savedListing;
    },

    delete: async(buyerId: Types.ObjectId, listingId: Types.ObjectId) => {
        const savedListing = await SavedListingModel.deleteOne({ buyer: buyerId, listing:listingId });
        return savedListing;
    }
};

