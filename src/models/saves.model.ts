import { model, Schema, Types } from "mongoose";

export const SavedListingSchema = new Schema(
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
  },
  { timestamps: true }
);

SavedListingSchema.index({ buyer: 1, listing: 1 }, { unique: true });
export const SavedListingModel = model("SavedListing", SavedListingSchema);
