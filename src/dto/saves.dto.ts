import { SavedListingDoc } from "../types/savesDoc";

export const toSavedListingResponse = (savedListing: SavedListingDoc[] | Partial<SavedListingDoc>[]) => {
    return savedListing.map(({listing, createdAt}) => ({
        listing, createdAt
    }));
}