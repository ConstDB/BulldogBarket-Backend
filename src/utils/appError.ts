export class AppError extends Error {
  public readonly statusCode: number;
  public readonly status: string;
  public readonly isOperational: boolean;
  public readonly errors?: any;

  constructor(message: string, statusCode: number, errors?: any) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${this.statusCode.toString().startsWith("4") ? "Failed" : "Error"}`;
    this.isOperational = true;
    this.errors = errors;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found") {
    super(message, 404);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string = "Bad request", errors?: any) {
    super(message, 400, errors);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized access") {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Forbidden") {
    super(message, 403);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = "Conflict") {
    super(message, 409);
  }
}
