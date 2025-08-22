import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
const createClashItem = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const files = req.files;
    console.log(files);
    res.json(new ApiResponse(200, "Clash item created successfully.", {}));
});
export { createClashItem };
