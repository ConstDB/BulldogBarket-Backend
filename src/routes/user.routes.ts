import { Router } from "express";
import { protect } from "../middlewares/protect.middleware";
import { getUserProfile } from "../controllers/user.controller";

const router = Router();

router.get("/me", protect, getUserProfile)
    .patch("/me", protect)

export default router;