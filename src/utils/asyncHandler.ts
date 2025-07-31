import { RequestHandler, Request, Response, NextFunction } from "express";
type asyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any >;

export const asyncHandler = (
  requestHandler: asyncRequestHandler
): RequestHandler => {
  return async (req, res, next) => {
    try {
      await requestHandler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};
