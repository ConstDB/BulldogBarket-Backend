import { getUserProfileService } from "../services/user.service";
import { asyncHandler } from "../utils/asyncHandlers";
import { Request, Response, NextFunction } from "express";

export const getUserProfile = asyncHandler(async (req: Request, res: Response) => {
    const user = await getUserProfileService(req.user._id);
    res.status(201).json({ user })
});

