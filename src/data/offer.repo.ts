import { OfferModel } from "../models/offer.model";
import { OfferDoc } from "../types/offerDoc";
import { CreateOffer } from "../validations/offer";

export interface CreateOfferData extends CreateOffer {
  buyer: string;
}

export interface FindFilter {
  listing: string;
  buyer: string;
  status: "pending" | "approved" | "rejected" | "cancelled";
}

export const OfferRepository = {
  findById: async (id: string) => {
    return OfferModel.findById(id);
  },

  findOne: async (filter: FindFilter) => {
    return OfferModel.findOne(filter);
  },

  create: async (data: CreateOfferData) => {
    return OfferModel.create({ ...data, listing: data.listingId });
  },

  cancelOffer: async (offerId: string) => {
    const offer = await OfferModel.findByIdAndUpdate(
      offerId,
      {
        status: "cancelled",
        respondedAt: new Date(),
      },
      { new: true }
    );

    return offer;
  },
};
