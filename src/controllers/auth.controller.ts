import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { loginUser, signupUser } from "../services/auth.service";
import { loginSchema, signupSchema } from "../validations/user";

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  const parsed = signupSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ errors: z.treeifyError(parsed.error) });
  }

  try {
    const { token, user } = await signupUser(parsed.data);
    res.status(201).json({ token, user });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unexpected error occured." });
    }
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const parsed = loginSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ errors: z.treeifyError(parsed.error) });
  }

  try {
    const { user, token } = await loginUser(parsed.data);

    res.status(200).json({
      token,
      user,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unexpected error occured." });
    }
  }
};
