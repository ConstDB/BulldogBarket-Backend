import { model, Schema, Types } from "mongoose";

export const OrderSchema = new Schema(
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
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    meetupLocation: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["GCash", "Cash on Meetup"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },
    sellerConfirmed: {
      type: Boolean,
      required: true,
      default: false,
    }, 
    buyerConfirmed: {
      type: Boolean,
      required: true,
      default: false,
    },
    cancelReason: {
      type: String,
      required: false,
    }, 
    settledAt: { 
      type: Date,
      required: false,
    },
  },
  { timestamps: true }
);

export const OrderModel = model("Order", OrderSchema);
