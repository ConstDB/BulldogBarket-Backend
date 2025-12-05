import { Router } from "express";
import { createListing } from "../controllers/listing.controller";
import { protect } from "../middlewares/protect.middleware";
import { validate } from "../middlewares/validate";
import { createListingSchema } from "../validations/listing";

const router = Router();

router.route("/").post(protect, validate(createListingSchema), createListing);

export default router;
