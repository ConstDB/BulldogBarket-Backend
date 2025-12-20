import { Router } from "express";
import { protect } from "../middlewares/protect.middleware";
import { getSellerDashboardSummary, getUserProfile, updateUserProfile } from "../controllers/user.controller";
import { updateUserProfileSchema } from "../validations/user";
import { validateResource } from "../middlewares/validateResource";

const router = Router();

router
  .get("/me", protect, getUserProfile)
  .patch("/me", protect, validateResource(updateUserProfileSchema), updateUserProfile);

router.route("/seller/dashboard/summary").get(protect, getSellerDashboardSummary);

export default router;
