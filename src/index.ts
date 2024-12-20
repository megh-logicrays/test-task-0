// config imports
import dotenv from "dotenv";
dotenv.config();

// library imports
import express, { Express, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";

// local imports
import { errorHandler } from "./middlewares/errorHandler.middleware";
import golbalRouter from "./routes";
import { rateLimiter } from "./config/rateLimiter";
import { logger } from "./config/logger";
import { connectToDatabase } from "./db/prisma.client";
import { registerCreateArticleWorkerEvents } from "./common/queue/articles.worker";
import { serverAdapter } from "./config/bullboard";

const app: Express = express();
const port = process.env.BACKEND_PORT || 3001;

// Middlewares
app.use(cors());
app.use(helmet());
app.use(rateLimiter);
app.use(express.json());

app.use('/bullboard', serverAdapter.getRouter());
app.use("/api/v1", golbalRouter);

// Health check route
app.get("/healthcheck", (req: Request, res: Response) => {
  res.status(200).json({ message: "Server is up and running" });
});

app.use(errorHandler);

// Registering Signal Kill Events
process.on("SIGINT", () => {
  console.log("Received SIGINT. Gracefully shutting down...");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("Received SIGTERM. Gracefully shutting down...");
  process.exit(0);
});

(async () => {
  try {
    await connectToDatabase();
    app.listen(port, () => {
      registerCreateArticleWorkerEvents();
      logger.info(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    logger.error("Failed to start the server:", error);
  }
})();
