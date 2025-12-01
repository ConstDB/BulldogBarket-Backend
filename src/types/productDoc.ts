import mongoose, {Document} from "mongoose"

export interface ProductDoc extends Document{
    sellerId: mongoose.Types.ObjectId;
    name: string;
    stocks: number;
    category: string;
    type: "single" | "bulk",
    price: number;
    condition: string;
    description: string;
    images: string[],
    createdAt: Date
}