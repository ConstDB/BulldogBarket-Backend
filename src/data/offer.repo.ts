import { ClientSession, Types } from "mongoose";
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

  getSellerOffers: async (listingId: Types.ObjectId[]) => {
    const pendingOffers = await OfferModel.find({ listing: { $in: listingId }, status: "pending" })
      .select("listing buyer buyerNote")
      .populate([
        { path: "listing", select: "name" },
        { path: "buyer", select: "name avatarUrl" },
      ])
      .lean();

    return pendingOffers;
  },

  getBuyerOffers: async (buyerId: Types.ObjectId) => {
    const pendingOffers = await OfferModel.find({ buyer: buyerId, status: "pending" })
      .select("listing buyer buyerNote status createdAt")
      .populate({
        path: "listing",
        select: "seller name condition price images",
        populate: {
          path: "seller",
          select: "name",
        },
      })
      .lean();

    return pendingOffers;
  },
};
