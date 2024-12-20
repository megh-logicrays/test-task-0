import { Request, Response, NextFunction } from "express";
import { ArticleService } from "../services/articles.services";
import { generateResponse } from "../utils/generateResponse";
import { AppError } from "../common/errors/AppError";
import { addJobArticleQueue } from "../common/queue/articles.queue";

const articleService = new ArticleService();

export class ArticleController {
  // Get all articles
  getAllArticles = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit, offset } = req.pagination;
      const articles = await articleService.getAllArticles({ offset, limit });
      generateResponse(res, 200, articles, "Articles retrieved successfully");
    } catch (error) {
      next(error);
    }
  };

  // Get an article by ID
  getArticleById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.validatedData?.params;
      const article = await articleService.getArticleById(Number(id));
      if (!article) {
        throw new AppError("Article not found", 404);
      }
      generateResponse(res, 200, article, "Article retrieved successfully");
    } catch (error) {
      next(error);
    }
  };

  // Create a new article
  createArticle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { nickname, title, content } = req.validatedData?.body;
      // const newArticle = await articleService.createArticle({
      //   nickname,
      //   title,
      //   content,
      // });

      const newArticle = await addJobArticleQueue({ nickname, title, content });

      generateResponse(
        res,
        201,
        newArticle.data,
        "Article created successfully",
      );
    } catch (error) {
      next(error);
    }
  };

  // Delete an article by ID
  deleteArticle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.validatedData?.params;
      const deletedArticle = await articleService.deleteArticle(Number(id));
      generateResponse(
        res,
        200,
        deletedArticle,
        "Article deleted successfully",
      );
    } catch (error) {
      next(error);
    }
  };
}
