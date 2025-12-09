import { Router } from "express";
import { createComment } from "../controllers/comment.controller";
import { protect } from "../middlewares/protect.middleware";
import { validateResource } from "../middlewares/validateResource";
import { createCommentSchema } from "../validations/comment";

const router = Router();

router.route("/").post(protect, validateResource(createCommentSchema), createComment);

export default router;
