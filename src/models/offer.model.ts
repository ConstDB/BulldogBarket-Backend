import { model, Schema, Types } from "mongoose";

export const OfferSchema = new Schema(
  {
    listing: {
      type: Types.ObjectId,
      required: true,
      ref: "Listing",
    },
    buyer: {
      type: Types.ObjectId,
      required: true,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "cancelled"],
      default: "pending",
    },
    meetupLocation: {
      type: String,
      required: true,
    },
    buyerNote: {
      type: String,
      required: false,
    },
    respondedAt: {
      type: Date,
      required: false,
    },
  },
  { timestamps: true }
);

export const OfferModel = model("Offer", OfferSchema);
