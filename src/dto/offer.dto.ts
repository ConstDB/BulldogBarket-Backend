import { OfferDoc } from "../types/offerDoc";

export const toOfferResponse = (offer: OfferDoc | Partial<OfferDoc>) => {
  const { _id, listing, buyer, status, meetupLocation, buyerNote } = offer;
  return { id: _id, listing, buyer, status, meetupLocation, buyerNote };
};

export const toPendingSellerOffersResponse = (offers: any[]) => {
  return offers.map((offer) => ({
    id: offer._id,
    buyerNote: offer.buyerNote,
    buyer: {
      id: offer.buyer._id,
      name: offer.buyer.name,
      avatarUrl: offer.buyer.avatarUrl,
    },
    listing: {
      id: offer.listing._id,
      name: offer.listing.name,
    },
  }));
};
