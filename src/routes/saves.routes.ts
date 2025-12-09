import { Router } from "express";
import { protect } from "../middlewares/protect.middleware";
import { createSavedListing, getSavedListing } from "../controllers/saves.controller";
import { validateResource } from "../middlewares/validateResource";
import { createSavedListingSchema } from "../validations/saves";


const router = Router();

router.route("/")
    .post(protect, validateResource(createSavedListingSchema),createSavedListing)
    .get(protect, getSavedListing);

export default router;