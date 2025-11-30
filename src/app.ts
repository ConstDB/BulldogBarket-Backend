import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Request, Response } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import hpp from "hpp";
import morgan from "morgan";
import { sanitize } from "./middlewares/sanitize";
import { env } from "./config/env";

const app = express();

if (env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGINS, credentials: true }));
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(sanitize);
app.use(hpp());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

// TODO: Error handler middleware, dito sya ilagay sa last pag meron na (app.use(errorHandler))
export default app;
