import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { imageUploadQueue, imageUploadQueueEvents, imageUploadQueueName, } from "../jobs/ImageUploadJob.js";
import prisma from "../config/database.js";
import { deleteFromCloudinary } from "../config/cloudinary.js";
const createClashItem = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const files = req.files;
    if (!files)
        throw new ApiError(422, "2 files are required.");
    if (files.length != 2)
        throw new ApiError(422, "2 files are required.");
    const uploadResponseArray = await Promise.allSettled(files.map(async (file) => {
        const result = await imageUploadQueue.add(imageUploadQueueName, {
            filePath: file.path,
        });
        return await result.waitUntilFinished(imageUploadQueueEvents);
    }));
    if (uploadResponseArray.some((response) => response.status === "rejected")) {
        for (const response of uploadResponseArray) {
            if (response.status === "fulfilled") {
                await deleteFromCloudinary(response.value.public_id);
            }
        }
        throw new ApiError(500, "File upload failed.");
    }
    const fullFilled = uploadResponseArray;
    const clashItems = await prisma.$transaction([
        prisma.clashItem.create({
            data: {
                image_url: fullFilled[0].value.secure_url,
                cloud_id: fullFilled[0].value.public_id,
                clash_id: id,
            },
        }),
        prisma.clashItem.create({
            data: {
                image_url: fullFilled[1].value.secure_url,
                cloud_id: fullFilled[1].value.public_id,
                clash_id: id,
            },
        }),
    ]);
    if (!clashItems) {
        for (const response of uploadResponseArray) {
            if (response.status === "fulfilled") {
                await deleteFromCloudinary(response.value.public_id);
            }
        }
        throw new ApiError(500, "Clash item creation failed.");
    }
    // console.log(clashItems);
    res.json(new ApiResponse(200, "Clash item created successfully.", {}));
});
const voteClashItem = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const clashItem = await prisma.clashItem.update({
        where: {
            id: id
        },
        data: {
            likes: {
                increment: 1
            }
        },
        select: {
            id: true,
            likes: true,
            image_url: true
        }
    });
    if (!clashItem)
        throw new ApiError(404, "Clash item not found.");
    res.json(new ApiResponse(200, "Clash item voted successfully.", {}));
});
export { createClashItem, voteClashItem };
