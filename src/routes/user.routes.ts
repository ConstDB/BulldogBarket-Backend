import { Router } from "express";
import {
  getSellerDashboardSummary,
  getUserProfile,
  updateUserProfile,
} from "../controllers/user.controller";
import { protect } from "../middlewares/protect.middleware";
import { validateResource } from "../middlewares/validateResource";
import { updateUserProfileSchema } from "../validations/user";

const router = Router();

router
  .get("/me", protect, getUserProfile)
  .patch("/me", protect, validateResource(updateUserProfileSchema), updateUserProfile);

router.route("/seller/dashboard/summary").get(protect, getSellerDashboardSummary);

export default router;
