import { Router } from "express";
import { login, signup } from "../controllers/auth.controller";
import { validateResource } from "../middlewares/validateResource";
import { loginSchema, signupSchema } from "../validations/user";

const router = Router();

router.post("/signup", validateResource(signupSchema), signup);
router.post("/login", validateResource(loginSchema), login);

export default router;
