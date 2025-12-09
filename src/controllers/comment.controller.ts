import { Request, Response } from "express";
import { CommentService } from "../services/comment.service";
import { asyncHandler } from "../utils/asyncHandlers";

export const createComment = asyncHandler(async (req: Request, res: Response) => {
  const { message } = req.body;
  const { listingId } = req.validatedParams;
  const comment = await CommentService.createComment(listingId, req.user._id.toString(), message);
  res.status(201).json(comment);
});

export const getComments = asyncHandler(async (req: Request, res: Response) => {
  const { listingId } = req.validatedParams;
  const comments = await CommentService.getComments(listingId);
  res.status(200).json(comments);
});
