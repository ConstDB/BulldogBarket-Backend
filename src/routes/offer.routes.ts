import { Router } from "express";
import { protect } from "../middlewares/protect.middleware";
import { validateResource } from "../middlewares/validateResource";
import { createOfferSchema } from "../validations/offer";
import { createOffer } from "../controllers/offer.controller";

const router = Router();

router.route("/").post(protect, validateResource(createOfferSchema), createOffer);

export default router;
