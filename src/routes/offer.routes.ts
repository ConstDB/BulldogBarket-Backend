import { Router } from "express";
import { protect } from "../middlewares/protect.middleware";
import { validateResource } from "../middlewares/validateResource";
import { createOfferSchema, offerIdParamsSchema } from "../validations/offer";
import { buyerCancelOffer, createOffer } from "../controllers/offer.controller";
import { validateParams } from "../middlewares/validateParams";

const router = Router();

router.route("/").post(protect, validateResource(createOfferSchema), createOffer);

router
  .route("/:offerId/cancel")
  .patch(protect, validateParams(offerIdParamsSchema), buyerCancelOffer);

export default router;
