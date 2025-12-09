import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";

export const validateParams = <T>(schema: ZodType<T>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const parsed = schema.safeParse(req.params);

    if (!parsed.success) {
      next(parsed.error);
      return;
    }

    req.validatedParams = parsed.data;
    next();
  };
};
