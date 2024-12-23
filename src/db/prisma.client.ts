import { PrismaClient } from "@prisma/client";
import { logger } from "../config/logger";

const prisma =
  process.env.NODE_ENV === "test"
    ? new PrismaClient({
        datasources: { db: { url: process.env.TEST_DATABASE_URL } },
      })
    : new PrismaClient();

async function connectToDatabase() {
  try {
    await prisma.$connect(); // Explicitly connect to the database
    logger.info("Database connected successfully!");
  } catch (error) {
    logger.error("Failed to connect to the database:", error);
  }
}

export { prisma, connectToDatabase };
