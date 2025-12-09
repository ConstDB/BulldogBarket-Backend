import { Request, Response } from "express";
import { CommentService } from "../services/comment.service";
import { asyncHandler } from "../utils/asyncHandlers";

export const createComment = asyncHandler(async (req: Request, res: Response) => {
  const { listingId, message } = req.body;
  const comment = await CommentService.createComment(listingId, req.user._id.toString(), message);
  res.status(201).json(comment);
});
