import { Router } from "express";
import { protect } from "../middlewares/protect.middleware";
import { validateResource } from "../middlewares/validateResource";
import { createOfferSchema, offerIdParamsSchema } from "../validations/offer";
import {
  approveOffer,
  buyerCancelOffer,
  createOffer,
  rejectOffer,
} from "../controllers/offer.controller";
import { validateParams } from "../middlewares/validateParams";

const router = Router();

router.route("/").post(protect, validateResource(createOfferSchema), createOffer);

router
  .route("/:offerId/cancel")
  .patch(protect, validateParams(offerIdParamsSchema), buyerCancelOffer);

router.route("/:offerId/reject").patch(protect, validateParams(offerIdParamsSchema), rejectOffer);

router.route("/:offerId/approve").patch(protect, validateParams(offerIdParamsSchema), approveOffer);

export default router;
