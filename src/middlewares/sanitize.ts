import { NextFunction, Request, Response } from "express";

const cleanObject = (obj: any) => {
  if (!obj || typeof obj !== "object") return;

  for (const key in obj) {
    if (key.startsWith("$") || key.includes(".")) {
      delete obj[key];
      continue;
    }

    if (obj[key] && typeof obj[key] === "object") {
      cleanObject(obj[key]);
    }
  }
};

export const sanitize = (req: Request, res: Response, next: NextFunction) => {
  if (req.body) cleanObject(req.body);
  if (req.query) cleanObject(req.query);
  if (req.params) cleanObject(req.params);

  next();
};
