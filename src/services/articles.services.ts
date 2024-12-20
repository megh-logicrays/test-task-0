import { Article, Comment } from "@prisma/client";
import { prisma } from "../db/prisma.client";
import { GetAllArticlesParams } from "../common/types/types";

export class ArticleService {
  // Fetch all articles with top-level comments and replies
  async getAllArticles({
    offset,
    limit,
  }: GetAllArticlesParams): Promise<{ articles: Article[]; totalArticles: number }> {
    // Fetch paginated articles along with top-level comments and their replies
    const articles = await prisma.article.findMany({
      include: {
        comments: {
          where: { parentId: null }, // Only top-level comments
          include: { replies: true }, // Include replies for each comment
        },
      },
      skip: offset, // Skip articles based on pagination offset
      take: limit,  // Limit the number of articles fetched
    });

    // Get the total number of articles
    const totalArticles = await prisma.article.count();

    return {
      articles,
      totalArticles,
    };
  }

  // Fetch a single article by ID with its comments and replies
  async getArticleById(id: number): Promise<Article | null> {
    return await prisma.article.findUnique({
      where: { id },
      include: {
        comments: {
          where: { parentId: null }, // Only top-level comments
          include: { replies: true }, // Include replies for each comment
        },
      },
    });
  }

  // Create a new article
  async createArticle(
    data: Omit<Article, "id" | "createdAt">,
  ): Promise<Article> {
    return await prisma.article.create({
      data,
    });
  }

  // Update an existing article
  async updateArticle(
    id: number,
    data: Partial<Omit<Article, "id" | "createdAt">>,
  ): Promise<Article> {
    return await prisma.article.update({
      where: { id },
      data,
    });
  }

  // Delete an article and cascade delete its comments
  async deleteArticle(id: number): Promise<Article> {
    // Delete the article and Prisma will handle cascading deletions
    // if `onDelete: Cascade` is configured in the database schema.
    return await prisma.article.delete({
      where: { id },
    });
  }

  // Get all comments for an article
  async getCommentsByArticle(articleId: number): Promise<Comment[]> {
    return await prisma.comment.findMany({
      where: { articleId, parentId: null },
      include: { replies: true },
    });
  }
}
