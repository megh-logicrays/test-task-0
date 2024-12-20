import { Worker } from "bullmq";
import { reddisConnection } from "../../config/reddisConnection";
import { ArticleService } from "../../services/articles.services";
import { logger } from "../../config/logger";
import { Article } from "@prisma/client";

const articleService = new ArticleService();

export const createArticleWorker = new Worker(
  "create-article",
  async (job: { data: Omit<Article, "id" | "createdAt"> }) => {
    return await articleService.createArticle(job.data);
  },
  {
    connection: reddisConnection,
  },
);

export const registerCreateArticleWorkerEvents = async () => {
  createArticleWorker.on("completed", (job, result) => {
    logger.info(`Job ${job?.id} completed with result: ${JSON.stringify(result)}`);
  });

  createArticleWorker.on("failed", (job, err) => {
    logger.error(`Job ${job?.id} failed with error: ${JSON.stringify(err)}`);
  });
};
