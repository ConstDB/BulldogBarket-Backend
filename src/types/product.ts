import mongoose from "mongoose"

export interface IProduct{
    seller_id: mongoose.Types.ObjectId;
    name: string;
    stocks: number;
    category: string;
    price: number;
    condition: string;
    description: string;
    tags: string[],
    images: string[],
    created_at: Date
}