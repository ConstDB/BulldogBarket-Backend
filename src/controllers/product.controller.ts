import express, { Request, Response, NextFunction } from "express";
import AppError from "../utils/appError";
import { CreateProductService } from "../services/product.service";
import {createProductSchema } from "../validations/product";
import { ValidateRequest } from "../middlewares/validate";
import z from "zod";

export const createProduct = async (
    req: ValidateRequest<z.infer<typeof createProductSchema>>,
    res: Response,
    next: NextFunction
) => {
    try{
        const product = await CreateProductService(req.body)
        res.status(201).json({
            sellerId: product.sellerId,
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