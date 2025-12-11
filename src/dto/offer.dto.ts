import { OfferDoc } from "../types/offerDoc";

export const toOfferResponse = (offer: OfferDoc | Partial<OfferDoc>) => {
  const { _id, listing, buyer, status, meetupLocation, buyerNote } = offer;
  return { id: _id, listing, buyer, status, meetupLocation, buyerNote };
};
