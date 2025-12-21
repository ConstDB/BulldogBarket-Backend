import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandlers";
import { loginUser, signupUser } from "../services/auth.service";

export const signup = asyncHandler(async (req: Request, res: Response) => {
  const { token, user } = await signupUser(req.body);
  res.status(201).json({ token, user });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { user, token } = await loginUser(req.body);
  res.status(200).json({ token, user });
});
