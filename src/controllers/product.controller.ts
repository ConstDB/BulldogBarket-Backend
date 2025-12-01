import express, { Request, Response, NextFunction } from "express";
import AppError from "../utils/appError";
import { CreateProduct } from "../services/product.service";
import { CreateProductDto } from "../validations/product";

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
    
}