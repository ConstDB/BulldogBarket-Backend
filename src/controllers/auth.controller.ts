import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { signupUser } from "../services/auth.service";
import { signupSchema } from "../validations/user";

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  const parsed = signupSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ errors: z.treeifyError(parsed.error) });
  }

  try {
    const { token, user } = await signupUser(parsed.data);
    res.status(201).json({
      token,
      user: {
        name: user.name,
        studentNumber: user.studentNumber,
        course: user.course,
        yearLevel: user.yearLevel,
        campus: user.campus,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unexpected error occured." });
    }
  }
};
