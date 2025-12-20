import { Router } from "express";
import {
  createComment,
  deleteComment,
  editComment,
  getComments,
} from "../controllers/comment.controller";
import {
  createListing,
  downvotes,
  getListingFeed,
  getSellerActiveListings,
  upvotes,
} from "../controllers/listing.controller";
import { protect } from "../middlewares/protect.middleware";
import { validate } from "../middlewares/validate";
import { validateParams } from "../middlewares/validateParams";
import { validateListingQuery } from "../middlewares/validateQuery";
import { commentIdParamsSchema, listingIdParamsSchema } from "../validations/comment";
import { createListingSchema } from "../validations/listing";

const router = Router();

router
  .route("/")
  .get(protect, validateListingQuery, getListingFeed)
  .post(protect, validate(createListingSchema), createListing);

router.route("/seller/active").get(protect, getSellerActiveListings);

router.route("/:id/upvotes").patch(protect, upvotes).delete(protect, downvotes);

router
  .route("/:listingId/comments")
  .post(protect, validateParams(listingIdParamsSchema), createComment)
  .get(protect, validateParams(listingIdParamsSchema), getComments);

router
  .route("/:listingId/comments/:commentId")
  .delete(protect, validateParams(commentIdParamsSchema), deleteComment)
  .patch(protect, validateParams(commentIdParamsSchema), editComment);

export default router;
