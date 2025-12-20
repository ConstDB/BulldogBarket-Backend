import { Types } from "mongoose";
import { ListingDoc } from "../types/listingDoc";

export const toListingRepsonse = (listing: ListingDoc | Partial<ListingDoc>) => {
  return {
    seller: listing.seller,
    id: listing._id,
    type: listing.type,
    name: listing.name,
    images: listing.images,
    price: listing.price,
    category: listing.category,
    description: listing.description,
    stocks: listing.stocks,
    condition: listing.condition,
    upvotes: listing.upvotes,
    comments: listing.comments,
  };
};

export const toListingFeedResponse = (listings: ListingDoc[]) => {
  return listings.map((listing) => ({
    seller: listing.seller,
    id: listing._id,
    type: listing.type,
    name: listing.name,
    images: listing.images,
    price: listing.price,
    category: listing.category,
    description: listing.description,
    stocks: listing.stocks,
    condition: listing.condition,
    upvotes: listing.upvotes,
    comments: listing.comments,
  }));
};

export const toSellerActiveListings = (listings: any[]) => {
  return listings.map((listing) => ({
    id: listing._id,
    name: listing.name,
    status: listing.status,
    stocks: listing.stocks,
    images: listing.images,
  }));
};
