import { CreateProductDto } from "../validations/product";
import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      validatedBody?: unknown; // Better than 'any'
    }
  }
}

export interface TypedRequest<T> extends Request {
  validatedBody: T;
}

export {};