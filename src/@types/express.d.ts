import { CreateProductDto } from "../validations/listing";
import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      validatedBody?: unknown; // Better than 'any'
    }
  }
}

export {};
