import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
import ApiError from "../utils/ApiError.js";
dotenv.config();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_CLOUD_KEY,
    api_secret: process.env.CLOUDINARY_CLOUD_SECRET,
});
export const uploadOnCloudinary = async (fileLocalPath, fileType = "image") => {
    try {
        if (!fileLocalPath) {
            throw new Error("File path is required for Cloudinary upload.");
        }
        const uploadResponse = await cloudinary.uploader.upload(fileLocalPath, {
            resource_type: fileType,
            transformation: { quality: "auto" },
        });
        return uploadResponse;
    }
    catch (error) {
        throw new ApiError(500, "File upload failed");
    }
    finally {
        if (fs.existsSync(fileLocalPath)) {
            fs.unlinkSync(fileLocalPath);
        }
    }
};
export const deleteFromCloudinary = async (publicId, fileType = "image") => {
    try {
        if (!publicId) {
            return null;
        }
        const deleteResponse = await cloudinary.uploader.destroy(publicId, {
            resource_type: fileType,
        });
        return deleteResponse;
    }
    catch (error) {
        throw new ApiError(500, "File delete failed");
    }
};
