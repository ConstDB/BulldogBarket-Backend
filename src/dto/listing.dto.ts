import { ListingDoc } from "../types/listingDoc";

export const toListingRepsonse = (listing: ListingDoc | Partial<ListingDoc>) => {
  const { seller, _id, type, name, images, price, category, description, stocks, condition, upvotes, comments } = listing;
  return { seller, _id, type, name, images, price, category, description, stocks, condition, upvotes, comments };
};

export const toListingFeedResponse = (listings: ListingDoc[]) => {
  return listings.map(({ seller, _id, type, name, images, price, category, description, stocks, condition, upvotes, comments }) => ({
    seller,
    _id,
    type,
    name,
    images,
    price,
    category,
    description,
    stocks,
    condition,
    upvotes,
    comments,
  }));
};
