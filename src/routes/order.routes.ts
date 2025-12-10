import { Router } from "express";
import { protect } from "../middlewares/protect.middleware";
import { validateResource } from "../middlewares/validateResource";
import { buyerCancelSchema, createOrderSchema } from "../validations/order";
import { buyerCancelOrder, createOrder } from "../controllers/order.controller";
import { validateParams } from "../middlewares/validateParams";

const router = Router();

router.route("/").post(protect, validateResource(createOrderSchema), createOrder);
router
  .route("/:orderId/buyer-cancel")
  .patch(protect, validateParams(buyerCancelSchema), buyerCancelOrder);

export default router;
