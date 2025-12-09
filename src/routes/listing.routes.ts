import { Router } from "express";
import { createListing, downvotes, getListingFeed, upvotes } from "../controllers/listing.controller";
import { protect } from "../middlewares/protect.middleware";
import { validate } from "../middlewares/validate";
import { validateListingQuery } from "../middlewares/validateQuery";
import { createListingSchema } from "../validations/listing";
import { validateParams } from "../middlewares/validateParams";
import { getCommentsParamsSchema } from "../validations/comment";
import { createComment } from "../controllers/comment.controller";

const router = Router();

router.route("/").get(protect, validateListingQuery, getListingFeed).post(protect, validate(createListingSchema), createListing);

router.route("/:id/upvotes").patch(protect, upvotes).delete(protect, downvotes);

router
  .route("/:listingId/comments")
  .post(protect, validateParams(getCommentsParamsSchema), createComment)
export default router;
