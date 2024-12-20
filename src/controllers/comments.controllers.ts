import { Request, Response, NextFunction } from "express";
import { CommentService } from "../services/comments.services";
import { generateResponse } from "../utils/generateResponse";

const commentService = new CommentService();

export class CommentController {
  // Get all comments for an article
  getCommentsByArticle = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { articleId } = req.validatedData?.params;
      const comments = await commentService.getCommentsByArticle(
        Number(articleId),
      );
      generateResponse(res, 200, comments, "Comments retrieved successfully");
    } catch (error) {
      next(error);
    }
  };

  // Create a comment for an article
  createCommentForArticle = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { articleId, nickname, content } = req.validatedData?.body;
      const newComment = await commentService.createCommentForArticle({
        articleId,
        nickname,
        content,
      });
      generateResponse(res, 201, newComment, "Comment created successfully");
    } catch (error) {
      next(error);
    }
  };

  // Create a reply to a comment
  createReplyToComment = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { parentId, nickname, content } = req.validatedData?.body;
      const newReply = await commentService.createReplyToComment({
        parentId,
        nickname,
        content,
      });
      generateResponse(res, 201, newReply, "Reply created successfully");
    } catch (error) {
      next(error);
    }
  };
}
