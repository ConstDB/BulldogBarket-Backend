import { z } from "zod";

export const createCommentSchema = z.object({
  message: z.string()
    .min(1, "Comment message is required.")
    .max(500, "Comment cannot exceed 500 characters.")
    .trim(),
  listingId: z.string()
    .min(1, "Listing ID is required.")
    .trim(),
});

export type CreateComment = z.infer<typeof createCommentSchema>;
