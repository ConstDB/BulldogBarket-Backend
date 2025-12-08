import { Document, Types } from "mongoose";
import { UserDoc } from "./userDoc";

export interface ListingDoc extends Document {
  seller: Types.ObjectId;
  type: "single" | "bulk";
  name: string;
  images: string[];
  price: number;
  category: string;
  description: string;
  status: "available" | "sold" | "reserved";
  stocks: number;
  condition?: string | null;
  upvotes: Types.ObjectId[] | UserDoc[];
  comments: {
    user: Types.ObjectId;
    message: string;
    createdAt: Date;
  }[];
}
