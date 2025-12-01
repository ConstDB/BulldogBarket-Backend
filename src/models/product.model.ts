import {model, Schema} from "mongoose";
import { ProductDoc } from "../types/productDoc";


const ProductSchema = new Schema<ProductDoc>(
    {
        sellerId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User"
        },
        name: {
            type: String,
            required: [true, "A product must have a name."],
        },
        stocks: {
            type: Number,
            required: [true, "A product must have a stocks"],
        },
        category: {
            type: String,
            required: [true, "A product must have a category"],
        },
        type: {
            type: String,
            enum: ["single", "bulk"],
            required: true
        },
        price: {
            type: Number,
            required: [true, "A product must have a price"],
        },
        condition: {
            type: String,
            required: [true, "A product must have a conditon"],
        },
        description: {
            type: String,
            required: true
        },
        images:{
            type: [String],
            required: [true, "A product must have an image"],
        },
        createdAt: Date
    },
    { timestamps: true}
);
export const ProductModel = model<ProductDoc>("Product", ProductSchema)