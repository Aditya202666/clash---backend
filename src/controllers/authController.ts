import { Response, Request } from "express";
import { registerSchema } from "../validators/authValidators.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body;
  const payload = registerSchema.parse(body);
});

export { registerUser };
