import { ProductModel } from "../models/product.model";
import { ProductDoc } from "../types/productDoc";
import { CreateProductDto } from "../validations/product";

export const ProductRepository = {
    create: async (data: CreateProductDto): Promise<ProductDoc> =>{
        const {sellerId, name, stocks, category, type, price, condition, description, images } = data
        const product = await ProductModel.create({sellerId, name, stocks, category, type, price, condition, description, images})
        return product
    }
}