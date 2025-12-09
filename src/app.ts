import cookieParser from "cookie-parser";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import hpp from "hpp";
import morgan from "morgan";

import { env } from "./config/env";
import { AppError } from "./utils/appError";

import { globalErrorHandler } from "./middlewares/error.middleware";
import { sanitize } from "./middlewares/sanitize";

import authRoutes from "./routes/auth.routes";
import listingRoutes from "./routes/listing.routes";
import offersRoutes from "./routes/offer.routes";
import orderRoutes from "./routes/order.routes";
import userRoutes from "./routes/user.routes";
import savedListingRoutes from "./routes/saves.routes"

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
app.use("/api/v1/listings", listingRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/offers", offersRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/users/saved-listings", savedListingRoutes)


app.use("/{*any}", (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server.`, 404));
});

app.use(globalErrorHandler);
export default app;
