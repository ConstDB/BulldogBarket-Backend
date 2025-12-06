import { getUserProfileService, updateUserProfileService } from "../services/user.service";
import { asyncHandler } from "../utils/asyncHandlers";
import { Request, Response, NextFunction } from "express";

export const getUserProfile = asyncHandler(async (req: Request, res: Response) => {
    const user = await getUserProfileService(req.user._id);
    res.status(201).json({ user })
});

export const updateUserProfile = asyncHandler(async (req: Request, res: Response) => {
    const user = await updateUserProfileService(req.user._id, req.body); 
    res.status(201).json({ user })
})