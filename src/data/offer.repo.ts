import { ClientSession } from "mongoose";
import { OfferModel } from "../models/offer.model";
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
  findById: async (id: string, session?: ClientSession) => {
    return OfferModel.findById(id).session(session ?? null);
  },

  findOne: async (filter: FindFilter) => {
    return OfferModel.findOne(filter);
  },

  create: async (data: CreateOfferData) => {
    return OfferModel.create({ ...data, listing: data.listingId });
  },

  approveOffer: async (offerId: string, session: ClientSession) => {
    return await OfferModel.findByIdAndUpdate(
      offerId,
      { status: "approved", respondedAt: new Date() },
      { new: true, session }
    );
  },

  cancelOffer: async (offerId: string) => {
    return await OfferModel.findByIdAndUpdate(
      offerId,
      {
        status: "cancelled",
        respondedAt: new Date(),
      },
      { new: true }
    );
  },

  rejectOffer: async (offerId: string) => {
    return await OfferModel.findByIdAndUpdate(offerId, { status: "rejected" }, { new: true });
  },
};
