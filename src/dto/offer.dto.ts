import { OfferDoc } from "../types/offerDoc";

export const toOfferResponse = (offer: OfferDoc | Partial<OfferDoc>) => {
  const { listing, buyer, status, meetupLocation, buyerNote } = offer;
  return { listing, buyer, status, meetupLocation, buyerNote };
};
