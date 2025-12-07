import { Router } from "express";
import { protect } from "../middlewares/protect.middleware";
import { validateResource } from "../middlewares/validateResource";
import { createOrderSchema } from "../validations/order";
import { createOrder } from "../controllers/order.controller";

const router = Router();

router.route("/").post(protect, validateResource(createOrderSchema), createOrder);

export default router;
