import { z } from "zod";

export const createCommentSchema = z.object({
  message: z.string().min(1, "Comment message is required.").max(500, "Comment cannot exceed 500 characters.").trim(),
});

export const getCommentsParamsSchema = z.object({
  listingId: z.string().min(1, "Listing ID is required."),
});

export type CreateComment = z.infer<typeof createCommentSchema>;
