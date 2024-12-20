import { Request, Response, NextFunction } from "express";
import { logger } from "../config/logger";
import { AppError } from "../common/errors/AppError";

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  logger.error(err);
  if (err instanceof AppError) {
    res.status(err.status).json({
      success: false,
      status: err.status,
      message: err.message || "Something went wrong",
      isOperration: err.isOperational
    });
  } else {
    res.status(500).json({
      success: false,
      status: 500,
      message: "Something went wrong",
      isOperation: false
    });
  }
};
