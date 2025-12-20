import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";

export const validateQuery = <T>(schema: ZodType<T>) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.query);

    if (!parsed.success) {
      next(parsed.error);
      return;
    }

    req.validatedQuery = parsed.data;
    next();
  };
};
