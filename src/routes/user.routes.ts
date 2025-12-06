import { Router } from "express";
import { protect } from "../middlewares/protect.middleware";
import { getUserProfile, updateUserProfile } from "../controllers/user.controller";
import { updateUserProfileSchema } from "../validations/user";
import { validateResource } from "../middlewares/validateResource";

const router = Router();

router.get("/me", protect, getUserProfile)
    .patch("/me", protect, validateResource(updateUserProfileSchema), updateUserProfile)

export default router;