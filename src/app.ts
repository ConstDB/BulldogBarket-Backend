import cookieParser from "cookie-parser";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import hpp from "hpp";
import morgan from "morgan";
import { env } from "./config/env";
import { sanitize } from "./middlewares/sanitize";
import authRoutes from "./routes/auth.routes";
import ProductRoutes from "./routes/product.route"

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

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1", ProductRoutes)

app.use("/{*any}", (req: Request, res: Response, next: NextFunction) => {
  // TODO: update this when the global error handler middleware is created
  res.status(404).json({ message: `Can't find ${req.originalUrl} on this server.` });
});

// TODO: Error handler middleware, dito sya ilagay sa last pag meron na (app.use(errorHandler))
export default app;
