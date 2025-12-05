import { ListingDoc } from "../types/listingDoc";

export const toListingRepsonse = (listing: ListingDoc | Partial<ListingDoc>) => {
  const { seller, type, name, images, price, category, description, stocks, condition, upvotes, comments } = listing;
  return { seller, type, name, images, price, category, description, stocks, condition, upvotes, comments };
};
