import { NextFunction, Request, Response } from "express";
import { listingQuerySchema } from "../validations/listing";

export const validateListingQuery = (req: Request, _res: Response, next: NextFunction) => {
  const parsed = listingQuerySchema.safeParse(req.query);

  if (!parsed.success) {
    next(parsed.error);
    return;
  }

  req.validatedQuery = parsed.data;
  next();
};
