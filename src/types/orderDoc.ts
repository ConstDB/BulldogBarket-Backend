import { Document, Types } from "mongoose";

export interface OrderDoc extends Document {
  listing: Types.ObjectId;
  buyer: Types.ObjectId;
  quantity: number;
  totalPrice: number;
  meetupLocation: string;
  paymentMethod: "GCash" | "Cash on Meetup";
  status: "pending approval" | "pending" | "completed" | "cancelled";
  sellerConfirmed?: boolean | null;
  buyerConfirmed?: boolean | null;
  cancelReason?: string | null;
  settledAt?: Date | null;
}
