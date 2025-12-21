import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";

export const validateResource = <T>(schema: ZodType<T>) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const parsed = schema.safeParse(req.body);

    if (!parsed.success) {
      next(parsed.error);
      return;
    }

    req.body = parsed.data;
    next();
  };
};
