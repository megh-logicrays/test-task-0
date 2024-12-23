import Redis from "ioredis";
import { logger } from "./logger";

export const reddisConnection = new Redis({
  host: "localhost",
  port: 6379,
  maxRetriesPerRequest: null,
});

// Test the Redis connection
reddisConnection.on("connect", () => {
  logger.info("Redis connected successfully!");
});

reddisConnection.on("error", (err) => {
  logger.error("An error occurred with the Redis connection:", err.message);
});
