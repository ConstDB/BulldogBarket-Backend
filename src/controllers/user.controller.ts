import { toPendingSellerOffersResponse } from "../dto/offer.dto";
import { toUserProfileResponse } from "../dto/user.dto";
import { UserService } from "../services/user.service";
import { asyncHandler } from "../utils/asyncHandlers";
import { Request, Response, NextFunction } from "express";

export const getUserProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = await UserService.getProfile(req.user._id);

  res.status(201).json(toUserProfileResponse(user));
});

export const updateUserProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = await UserService.updateProfile(req.user._id, req.body);

  res.status(201).json(toUserProfileResponse(user));
});

export const getSellerDashboardSummary = asyncHandler(
  async (req: Request, res: Response) => {
    const sellerId = req.user._id.toString();
    const sellerDashboardSummary = await UserService.getSellerDashboardSummary(sellerId);

    res.status(200).json(sellerDashboardSummary);
  }
);
