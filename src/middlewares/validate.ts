import { ZodType, z } from "zod";
import { Request, Response, NextFunction } from "express";

export const validate = <T>(schema: ZodType<T>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    
    if (!result.success) {
      res.status(400).json({
        errors: z.treeifyError(result.error),
      });
      return;
    }
    
    req.validatedBody = result.data;
    next();
  };
};