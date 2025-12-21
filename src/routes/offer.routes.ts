import { Router } from "express";
import {
  approveOffer,
  buyerCancelOffer,
  createOffer,
  getSellerPendingOffers,
  rejectOffer,
} from "../controllers/offer.controller";
import { protect } from "../middlewares/protect.middleware";
import { validateParams } from "../middlewares/validateParams";
import { validateResource } from "../middlewares/validateResource";
import { createOfferSchema, offerIdParamsSchema } from "../validations/offer";

const router = Router();

router.route("/").post(protect, validateResource(createOfferSchema), createOffer);
router.route("/seller/pending").get(protect, getSellerPendingOffers);
router
  .route("/:offerId/cancel")
  .patch(protect, validateParams(offerIdParamsSchema), buyerCancelOffer);
router
  .route("/:offerId/reject")
  .patch(protect, validateParams(offerIdParamsSchema), rejectOffer);
router
  .route("/:offerId/approve")
  .patch(protect, validateParams(offerIdParamsSchema), approveOffer);

export default router;
