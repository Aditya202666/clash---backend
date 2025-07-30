import { registerSchema } from "../validators/authValidators.js";
import { asyncHandler } from "../utils/asyncHandler.js";
const registerUser = asyncHandler(async (req, res) => {
    const body = req.body;
    const payload = registerSchema.parse(body);
});
export { registerUser };
