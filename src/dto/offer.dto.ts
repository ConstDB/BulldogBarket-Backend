import { OfferDoc } from "../types/offerDoc";

export const toOfferResponse = (offer: OfferDoc | Partial<OfferDoc>) => {
  const { _id, listing, buyer, status, meetupLocation, buyerNote } = offer;
  return { id: _id, listing, buyer, status, meetupLocation, buyerNote };
};

export const toPendingSellerOffersResponse = (offers: any[]) => {
  return offers.map((offer) => ({
    id: offer._id,
    listing: {
      id: offer.listing._id,
      name: offer.listing.name,
    },
    buyer: {
      id: offer.buyer._id,
      name: offer.buyer.name,
      avatarUrl: offer.buyer.avatarUrl,
    },
    buyerNote: offer.buyerNote,
  }));
};
