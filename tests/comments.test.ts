import request from "supertest";
import appInstance from "../src/lib/ExpressAppProvider";
import { prisma } from "../src/db/prisma.client";
import { AppError } from "../src/common/errors/AppError";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const app = appInstance.getServer();
const baseUrl = "/api/v1/comments";

const mockNewReply = {
  id: 3,
  nickname: "replyuser",
  content: "This is a reply to a comment",
  createdAt: new Date("2024-12-23T09:24:37.476Z"),
  updatedAt: new Date("2024-12-23T09:24:37.476Z"),
  parentId: 1,
  articleId: null,
};

beforeEach(() => {
  jest.restoreAllMocks();
});

describe("Tests for Comments: /api/v1/comments", () => {
  describe("GET /api/v1/comments/article/:articleId", () => {
    it("should return 200 OK with empty comments", async () => {
      jest.spyOn(prisma.comment, "findMany").mockResolvedValue([]);
      const response = await request(app).get(`${baseUrl}/article/1`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        status: 200,
        message: "Comments retrieved successfully",
        data: [],
      });
    });

    it("should return 200 OK with comments list", async () => {
      jest.spyOn(prisma.comment, "findMany").mockResolvedValue([mockNewReply]);

      const response = await request(app).get(`${baseUrl}/article/1`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        status: 200,
        message: "Comments retrieved successfully",
        data: [
          {
            ...mockNewReply,
            createdAt: "2024-12-23T09:24:37.476Z",
            updatedAt: "2024-12-23T09:24:37.476Z",
          },
        ],
      });
    });
  });

  describe("POST /api/v1/comments/article", () => {
    it("should return 201 Created with new comment", async () => {
      const newCommentData = {
        articleId: 1,
        content: "This is a new comment",
        nickname: "testuser",
      };

      const mockNewComment = {
        ...newCommentData,
        id: 2,
        createdAt: new Date("2024-12-23T09:24:37.383Z"),
        updatedAt: new Date("2024-12-23T09:24:37.383Z"),
        parentId: null,
      };

      jest.spyOn(prisma.comment, "create").mockResolvedValue(mockNewComment);

      const response = await request(app)
        .post(`${baseUrl}/article`)
        .send(newCommentData);

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        success: true,
        status: 201,
        message: "Comment created successfully",
        data: {
          ...mockNewComment,
          createdAt: "2024-12-23T09:24:37.383Z",
          updatedAt: "2024-12-23T09:24:37.383Z",
        },
      });
    });

    it("should return 400 Bad Request on validation failure", async () => {
      const invalidCommentData = {
        articleId: 1,
        content: "", // Content is required
      };

      const response = await request(app)
        .post(`${baseUrl}/article`)
        .send(invalidCommentData);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        success: false,
        status: 400,
        message: expect.any(String),
        isOperation: true,
      });
    });

    it("should return 404 when articleId is not found", async () => {
      const invalidCommentData = {
        articleId: 999,
        content: "This is a new comment",
        nickname: "testuser",
      };

      jest
        .spyOn(prisma.article, "findUnique")
        .mockRejectedValue(new PrismaClientKnownRequestError("Article not found", {
          code: "P2025",
          clientVersion: "4.9.0",
        }));

      const response = await request(app)
        .post(`${baseUrl}/article`)
        .send(invalidCommentData);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        success: false,
        status: 404,
        message: "Parent not found!",
        isOperation: true,
      });
    });
  });

  describe("POST /api/v1/comments/reply", () => {
    it("should return 201 Created with new reply", async () => {
      const newReplyData = {
        parentId: 1,
        content: "This is a reply to a comment",
        nickname: "replyuser",
      };

      const mockNewReply = {
        ...newReplyData,
        id: 3,
        createdAt: new Date("2024-12-23T09:24:37.476Z"),
        updatedAt: new Date("2024-12-23T09:24:37.476Z"),
        articleId: null,
      };

      jest.spyOn(prisma.comment, "create").mockResolvedValue(mockNewReply);

      const response = await request(app)
        .post(`${baseUrl}/reply`)
        .send(newReplyData);

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        success: true,
        status: 201,
        message: "Reply created successfully",
        data: {
          ...mockNewReply,
          createdAt: "2024-12-23T09:24:37.476Z",
          updatedAt: "2024-12-23T09:24:37.476Z",
        },
      });
    });

    it("should return 400 Bad Request if parentId is missing", async () => {
      const invalidReplyData = {
        content: "This is a reply",
      };

      const response = await request(app)
        .post(`${baseUrl}/reply`)
        .send(invalidReplyData);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        success: false,
        status: 400,
        message: expect.any(String),
        isOperation: true,
      });
    });

    it("should return 404 when parentId is not found", async () => {
      const invalidReplyData = {
        parentId: 999,
        content: "This is a reply to a comment",
        nickname: "replyuser",
      };

      jest
        .spyOn(prisma.comment, "create")
        .mockRejectedValue(new AppError("Parent not found!", 404));

      const response = await request(app)
        .post(`${baseUrl}/reply`)
        .send(invalidReplyData);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        success: false,
        status: 404,
        message: "Parent not found!",
        isOperation: true,
      });
    });
  });
});
