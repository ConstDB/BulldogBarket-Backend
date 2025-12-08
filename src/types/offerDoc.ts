import { Document, Types } from "mongoose";

export interface OfferDoc extends Document {
  listing: Types.ObjectId;
  buyer: Types.ObjectId;
  status: "pending" | "approved" | "rejected" | "cancelled";
  meetupLocation: string;
  buyerNote?: string | null;
}
