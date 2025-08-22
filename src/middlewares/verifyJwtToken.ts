import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import ApiError from "../utils/ApiError.js";

export const verifyJwtToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new ApiError(401, "Unauthorized.");
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
      if (err?.message) {
        throw new ApiError(401, "Unauthorized.");
      }

      req.user = user as AuthUser;
      next();
    });
    
  } catch (error) {
    next(error);
  }
};
