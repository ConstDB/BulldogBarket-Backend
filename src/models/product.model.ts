import {model, Schema} from "mongoose";
import { IProduct } from "../types/product";


const ProductSchema = new Schema<IProduct>(
    {
        seller_id: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User"
        },
        name: {
            type: String,
            required: true,
        },
        stocks: {
            type: Number,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        condition: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        tags:{
            type: [String],
            required: true,
        },
        images:{
            type: [String],
            required: true,
        },
        created_at:{
            type: Date,
            required: true,
        }

    }
)
export default model<IProduct>("Product", ProductSchema)