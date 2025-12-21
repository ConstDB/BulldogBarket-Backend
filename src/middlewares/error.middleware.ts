import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { env } from "../config/env";
import { BadRequestError, UnauthorizedError } from "../utils/appError";

const handleZodError = (error: ZodError): BadRequestError => {
  const fieldErrors: Record<string, string[]> = {};

  error.issues.forEach((issue) => {
    const path = issue.path.join(".");
    const message = issue.message;

    if (!fieldErrors[path]) {
      fieldErrors[path] = [];
    }

    fieldErrors[path].push(message);
  });

  return new BadRequestError("Validation Failed", fieldErrors);
};

const handleCastErrorDB = (error: any): BadRequestError => {
  const message = `Invalid ${error.path}: ${error.value}.`;
  return new BadRequestError(message);
};

const handleDuplicateFieldsDB = (error: any): BadRequestError => {
  const value = error.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new BadRequestError(message);
};

const handleJWTError = () => new UnauthorizedError("Invalid token. Please log in again.");
const handleJWTExpiredError = () => new UnauthorizedError("Your token has expired. Please log in again.");

const sendErrorDev = (err: any, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    errors: err.errors,
    stack: err.stack,
  });
};

const sendErrorProd = (err: any, res: Response) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      errors: err.errors,
    });
  } else {
    console.error("ERROR ", err);
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ZodError || err.name === "ZodError") err = handleZodError(err);
  if (err.name === "CastError") err = handleCastErrorDB(err);
  if (err.code === 11000) err = handleDuplicateFieldsDB(err);
  if (err.name === "JsonWebTokenError") err = handleJWTError();
  if (err.name === "TokenExpiredError") err = handleJWTExpiredError();

  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (env.NODE_ENV === "production") {
    sendErrorProd(err, res);
  }
};
