import { Request } from "express";

export function getValidatedBody<T>(req: Request): T {
    return req.validatedBody as T
}