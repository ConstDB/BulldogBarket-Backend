/// <reference path="../../types/express/index.d.ts" />

import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { UserModel } from "../models/user.model";
import { UnauthorizedError } from "../utils/appError";

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(new UnauthorizedError("You are not logged in! Please log in first to get access to this route and resources"));
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string };
    const currentUser = await UserModel.findById(decoded.id);

    if (!currentUser) {
      return next(new UnauthorizedError("The user belonging to this token no longer exist"));
    }

    req.user = currentUser;

    next();
  } catch {
    return next(new UnauthorizedError("Unauthorized."));
  }
};
