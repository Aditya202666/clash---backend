import { NextFunction, Request, Response } from "express";
import ApiError from "../utils/ApiError.js";
import { ZodError, z } from "zod";
import ApiResponse from "../utils/ApiResponse.js";

export const errorHandlerMiddleware = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  //  * Default values in case error is not APiError
  let statusCode = 422;
  let message = "Validation Error.";
  let success = false;

  if (err instanceof ZodError) {
    const flattedError = z.flattenError(err);
    res.status(statusCode).json(new ApiResponse(statusCode, message, flattedError));
    console.log(flattedError);
    return;
  }

  if (process.env.NODE_ENV === "development") {
    console.error("Error Stack:", (err as Error).stack);
  } else {
    console.error("Error Message:", message);
  }

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  res.status(statusCode).json(new ApiResponse(statusCode, message));
};

export default errorHandlerMiddleware;
