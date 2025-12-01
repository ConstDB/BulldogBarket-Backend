import { error } from "console";
import { Request, Response, NextFunction } from "express";
import { ZodType, z } from "zod";

export interface ValidateRequest<T> extends Request{
    body: T;
}

export const validateBody = <T>(schema: ZodType<T>) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const parsed = schema.safeParse(req.body);

        if (!parsed.success){
            res.status(400).json({ error: z.treeifyError(parsed.error)})
            return;
        }

        req.body = parsed.data;
        next();
    };
};