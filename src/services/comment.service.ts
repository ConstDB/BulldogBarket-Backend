import { ListingRepository } from "../data/listing.repo";
import { BadRequestError, NotFoundError } from "../utils/appError";

export const CommentService = {
  createComment: async (listingId: string, userId: string, message: string) => {
    const listing = await ListingRepository.findById(listingId);

    if (!listing) {
      throw new NotFoundError("Listing not found.");
    }

    if (listing.status === "sold") {
      throw new BadRequestError("You cannot comment on sold listings.");
    }

    const comment = await ListingRepository.addCommentToListing(listingId, userId, message);

    if (!comment) {
      throw new NotFoundError("Listing was deleted or comment was not added.");
    }

    return comment;
  },

  getComments: async (listingId: string) => {
    const comments = await ListingRepository.getComments(listingId);

    if (!comments) {
      throw new NotFoundError("Listing or comments not found.");
    }

    return comments;
  },

  editComment: async (listingId: string, commentId: string, userId: string, message: string) => {
    return ListingRepository.editComment(listingId, commentId, userId, message);
  },

  deleteComment: async (listingId: string, commentId: string, userId: string) => {
    await ListingRepository.deleteComment(listingId, commentId, userId);
  },
};
