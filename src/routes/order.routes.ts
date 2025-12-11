import { Router } from "express";
import {
  buyerCancelOrder,
  buyerConfirm,
  createOrder,
  sellerCancelOrder,
} from "../controllers/order.controller";
import { protect } from "../middlewares/protect.middleware";
import { validateParams } from "../middlewares/validateParams";
import { validateResource } from "../middlewares/validateResource";
import {
  cancelReasonBodySchema,
  createOrderSchema,
  orderIdParamsSchema,
} from "../validations/order";

const router = Router();

router.route("/").post(protect, validateResource(createOrderSchema), createOrder);

router
  .route("/:orderId/buyer-cancel")
  .patch(protect, validateParams(orderIdParamsSchema), buyerCancelOrder);
router
  .route("/:orderId/seller-cancel")
  .patch(
    protect,
    validateParams(orderIdParamsSchema),
    validateResource(cancelReasonBodySchema),
    sellerCancelOrder
  );

router
  .route("/:orderId/complete/buyer")
  .patch(protect, validateParams(orderIdParamsSchema), buyerConfirm);

export default router;
