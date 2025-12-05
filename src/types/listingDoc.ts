import mongoose, { Document, Types } from "mongoose";
import { UserDoc } from "./userDoc";

export interface ListingDoc extends Document {
  seller: mongoose.Types.ObjectId;
  type: "single" | "bulk";
  name: string;
  images: string[];
  price: number;
  category: string;
  description: string;
  stocks?: number | null;
  condition?: string | null;
  upvotes: Types.ObjectId[] | UserDoc[];
  comments: {
    user: Types.ObjectId;
    message: string;
    createdAt: Date;
  }[];
}
