import { Router } from "express";
import { createListing, getListingFeed, upvotes } from "../controllers/listing.controller";
import { protect } from "../middlewares/protect.middleware";
import { validate } from "../middlewares/validate";
import { validateListingQuery } from "../middlewares/validateQuery";
import { createListingSchema } from "../validations/listing";

const router = Router();

router.route("/")
  .get(protect, validateListingQuery, getListingFeed)
  .post(protect, validate(createListingSchema), createListing);

router.route("/:id/upvotes")
  .patch(protect, upvotes);
export default router;
