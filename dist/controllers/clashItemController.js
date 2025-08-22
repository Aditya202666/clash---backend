import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { imageUploadQueue, imageUploadQueueEvents, imageUploadQueueName, } from "../jobs/ImageUploadJob.js";
const createClashItem = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const files = req.files;
    if (!files)
        throw new ApiError(422, "2 files are required.");
    if (files.length != 2)
        throw new ApiError(422, "2 files are required.");
    const uploadResponseArray = await Promise.all(files.map(async (file) => {
        const result = await imageUploadQueue.add(imageUploadQueueName, {
            filePath: file.path,
        });
        return await result.waitUntilFinished(imageUploadQueueEvents);
    }));
    // todo: create table for clash item
    console.log(uploadResponseArray);
    res.json(new ApiResponse(200, "Clash item created successfully.", {}));
});
export { createClashItem };
