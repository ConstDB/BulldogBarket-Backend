import { CreateProductDto } from "../validations/product";
import { Request, Response, NextFunction } from "express";
import { CreateProductService, GetProductService } from "../services/product.service";
import z from "zod";
import { getValidatedBody } from "../utils/request";

export const createProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try{
        const data = getValidatedBody<CreateProductDto>(req);
        const product = await CreateProductService(data)
        res.status(201).json({
            id: product._id,
            name: product.name,
            stocks: product.stocks,
            category: product.category,
            type: product.type,
            price: product.price,
            condition: product.condition,
            description: product.description,
            images: product.images
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message })
        } else {
            res.status(500).json({ message: "An unexpected error occured."})
        }
    }
}

export const getProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try{
        const { id } = req.params;
        
        if (!id){
            return res.status(400).json({ message: "ProductId is required."})
        }
        const product = await GetProductService(id)

        if (!product){
            return res.status(404).json({ message: "Product not found"}) 
        }

        const seller = product.sellerId as unknown as {
            name:string,
            avatarUrl: string
        }

        res.status(200).json({
            id: product._id,
            name: product.name,
            sellerName: seller.name,
            sellerAvatar: seller.avatarUrl,
            stocks: product.stocks,
            category: product.category,
            type: product.type,
            price: product.price,
            condition: product.condition,
            description: product.description,
            images: product.images, 
            createdAt: product.createdAt
        })
    } catch (error: unknown){
        if (error instanceof Error) {
            res.status(500).json({ message: error.message })
        } else {
            res.status(500).json({ message: "An unexpected error occured."})
        } 
    }
}