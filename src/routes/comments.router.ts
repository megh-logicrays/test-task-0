import express from "express";
import { CommentController } from "../controllers/comments.controllers";
import { validateRequest } from "../middlewares/validation.middleware";
import {
  createCommentForArticleSchema,
  createReplyToCommentSchema,
  getCommentsByArticleSchema,
} from "../validationSchemas/comments.validations";

const commentRouter = express.Router();
const commentController = new CommentController();

commentRouter.get(
  "/article/:articleId",
  validateRequest(getCommentsByArticleSchema),
  commentController.getCommentsByArticle,
);
commentRouter.post(
  "/article",
  validateRequest(createCommentForArticleSchema),
  commentController.createCommentForArticle,
);
commentRouter.post(
  "/reply",
  validateRequest(createReplyToCommentSchema),
  commentController.createReplyToComment,
);

export default commentRouter;
