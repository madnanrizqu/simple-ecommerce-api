import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import config from "config";

import AppError from "./utils/appError";
import { generateJson } from "./utils/genJson";

import v1Router from "./v1/routes";

const app = express();

// MIDDLEWARE
// 1.Body Parser
app.use(express.json({ limit: "10kb" }));

// 2. Cookie Parser
app.use(cookieParser());

// 3. Cors
app.use(cors());

// 4 Logger
if (config.get("nodeEnv") === "development") app.use(morgan("dev"));

// ROUTES
app.use("/api/v1", v1Router);

// HEALTH CHECK
app.get("/api/health_check", (_, res: Response) => {
  res.status(200).json(
    generateJson({
      code: 200,
      message: "Simple ECommerce API is healthy",
    })
  );
});

app.get("/", (req, res) => {
  res.status(200).json(
    generateJson({
      code: 200,
      message: "Welcome to Simple ECommerce API",
    })
  );
});

// UNHANDLED ROUTES
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(404, `Route ${req.originalUrl} not found`));
});

// GLOBAL ERROR HANDLER
app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
  err.status = err.status || "error";
  err.statusCode = err.statusCode || 500;

  console.error(err);

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

export default app;
