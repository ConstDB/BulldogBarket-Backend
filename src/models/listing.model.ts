import { model, Schema, Types } from "mongoose";

export const CommentSchema = new Schema({
  user: { type: Types.ObjectId, required: true, ref: "User" },
  message: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
});

export const ListingSchema = new Schema(
  {
    seller: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    type: {
      type: String,
      enum: ["single", "bulk"],
      required: true,
    },
    name: {
      type: String,
      required: [true, "A product must have a name."],
    },
    images: {
      type: [String],
      required: [true, "A product must have an image"],
    },
    price: {
      type: Number,
      required: [true, "A product must have a price"],
    },
    category: {
      type: String,
      required: [true, "A product must have a category"],
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "sold", "reserved"],
      default: "available",
    },
    stocks: {
      type: Number,
      required: true,
      default: 1,
    },
    // ADDITIONAL FIELD FOR SINGLE
    condition: {
      type: String,
      required: false,
    },
    upvotes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [CommentSchema],
  },
  { timestamps: true }
);

export const ListingModel = model("Listing", ListingSchema);
