import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
export const verifyJwtToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            throw new ApiError(401, "Unauthorized.");
        }
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err?.message) {
                throw new ApiError(401, "Unauthorized.");
            }
            req.user = user;
            next();
        });
    }
    catch (error) {
        next(error);
    }
};
