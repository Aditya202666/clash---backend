import { Request, Response } from "express";

import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { clashSchema } from "../validators/clashValidators.js";
import {
  deleteFromCloudinary,
} from "../config/cloudinary.js";
import prisma from "../config/database.js";
import ApiError from "../utils/ApiError.js";
import {
  imageUploadQueue,
  imageUploadQueueEvents,
  imageUploadQueueName,
} from "../jobs/ImageUploadJob.js"; 

const createClash = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body;
  const payload = clashSchema.parse(body);

  const filePath = req.file?.path;
  if (!filePath) throw new ApiError(422, "File is required.");

  const result = await imageUploadQueue.add(imageUploadQueueName, { filePath });
  const response = await result.waitUntilFinished(imageUploadQueueEvents);

  const clash = await prisma.clash.create({
    data: {
      title: payload.title,
      description: payload.description,
      user_id: req.user?.id!,
      expire_at: payload.expire_at,

      banner: {
        create: {
          image_url: response?.secure_url,
          cloud_id: response?.public_id,
        },
      },
    },
  });

  res.json(new ApiResponse(200, "Clash created."));
});

const getAllClashes = asyncHandler(async (req: Request, res: Response) => {
  const clashes = await prisma.clash.findMany({
    where: {
      user_id: req.user?.id,
    },
    include: {
      banner: {
        select: {
          image_url: true,
        },
      },
    },
    orderBy: { created_at: "desc" },
  });
  res.json(new ApiResponse(200, "Clashes fetched.", clashes));
});

const getClash = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const clash = await prisma.clash.findUnique({
    where: {
      id: id,
    },
    include: {
      banner: {
        select: {
          image_url: true,
        },
      },
    },
  });
  if (!clash) throw new ApiError(404, "Clash not found.");

  res.json(new ApiResponse(200, "Clash fetched successfully.", clash));
});

const updateClashDetails = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body;

  console.log(body);

  const payload = clashSchema.parse(body);

  const { id } = req.params;

  const clash = await prisma.clash.update({
    where: {
      id: id,
    },
    data: {
      title: payload.title,
      description: payload.description,
      expire_at: payload.expire_at,
    },
  });
  res.json(new ApiResponse(200, "Clash updated successfully.", { clash }));
});

const updateBanner = asyncHandler(async (req: Request, res: Response) => {
  const { id, banner_id } = req.params;
  const filePath = req.file?.path;

  if (!filePath) throw new ApiError(422, "File is required.");

  const oldBanner = await prisma.clashBanner.findUnique({
    where: {
      id: banner_id,
    },
  });

  if (!oldBanner) throw new ApiError(404, "Banner not found.");

  const result = await imageUploadQueue.add(imageUploadQueueName, { filePath });
  const response = await result.waitUntilFinished(imageUploadQueueEvents);

  if (!response) throw new ApiError(500, "File upload failed.");

  const deleteBanner = await deleteFromCloudinary(oldBanner.cloud_id!);
  if (!deleteBanner) throw new ApiError(500, "File delete failed.");

  const banner = await prisma.clashBanner.update({
    where: {
      id: banner_id,
    },
    data: {
      image_url: response?.secure_url!,
      cloud_id: response?.public_id!,
    },
  });

  if (!banner) throw new ApiError(404, "Banner not found.");

  res.json(new ApiResponse(200, "Banner updated successfully.", {}));
});

const deleteClash = asyncHandler(async (req: Request, res: Response) => {
  const { id, banner_id } = req.params;

  const banner = await prisma.clashBanner.findUnique({
    where: {
      id: banner_id,
    },
  });
  if (!banner) throw new ApiError(404, "Banner not found.");

  const cloud_id = banner.cloud_id;

  const clash = await prisma.clash.delete({
    where: {
      id: id,
    },
  });
  if (!clash) throw new ApiError(404, "Clash not found.");

  const deleteBanner = await deleteFromCloudinary(cloud_id!);
  if (!deleteBanner) throw new ApiError(500, "File delete failed.");

  res.json(new ApiResponse(200, "Clash deleted successfully."));
});

export {
  createClash,
  getAllClashes,
  getClash,
  updateClashDetails,
  updateBanner,
  deleteClash,
};
