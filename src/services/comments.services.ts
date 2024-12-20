import { Comment } from "@prisma/client";
import { prisma } from "../db/prisma.client";

export class CommentService {
  // Fetch all comments for an article
  async getCommentsByArticle(articleId: number): Promise<Comment[]> {
    return await prisma.comment.findMany({
      where: { articleId, parentId: null },
      include: { replies: true },
    });
  }

  // Fetch a comment by ID with its replies
  async getCommentById(id: number): Promise<Comment | null> {
    return await prisma.comment.findUnique({
      where: { id },
      include: { replies: true, parentComment: true },
    });
  }

  // Create a comment for an article
  async createCommentForArticle(
    data: Omit<Comment, "id" | "createdAt" | "parentId">,
  ): Promise<Comment> {
    return await prisma.comment.create({
      data,
    });
  }

  // Create a reply to a comment
  async createReplyToComment(
    data: Omit<Comment, "id" | "createdAt" | "articleId">,
  ): Promise<Comment> {
    return await prisma.comment.create({
      data,
    });
  }

  // Update a comment
  async updateComment(
    id: number,
    data: Partial<Omit<Comment, "id" | "createdAt">>,
  ): Promise<Comment> {
    return await prisma.comment.update({
      where: { id },
      data,
    });
  }

  // Delete a comment
  async deleteComment(id: number): Promise<Comment> {
    return await prisma.comment.delete({
      where: { id },
    });
  }
}
