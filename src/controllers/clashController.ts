import { Request, Response } from "express";

import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { clashSchema } from "../validators/clashValidators.js";
import { uploadOnCloudinary } from "../config/cloudinary.js";
import prisma from "../config/database.js";
import ApiError from "../utils/ApiError.js";

const createClash = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body;
  const payload = clashSchema.parse(body);

  const filePath = req.file?.path;
  if (!filePath) throw new ApiError(422, "File is required.");

  const response = await uploadOnCloudinary(filePath);

  const banner = await prisma.image.create({
    data: {
      image_url: response?.secure_url!,
      image_id: response?.public_id!,
    },
  });

  const clash = await prisma.clash.create({
    data: {
      title: payload.title,
      description: payload.description,
      banner_id: banner.id,
      user_id: req.user?.id!,
      expire_at: payload.expire_at,
    },
  });

  res.json(new ApiResponse(200, "Clash created.", { clash, banner }));
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
  res.json(new ApiResponse(200, "Clashes fetched.", { clashes }));
});

const getClash = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const clash = await prisma.clash.findUnique({
    where: {
      id: id,
      user_id: req.user?.id,
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

  res.json(new ApiResponse(200, "Clash fetched successfully.", clash ));
});

const updateClashDetails = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body;
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
  
})

const updateBanner = asyncHandler(async (req: Request, res: Response) => {
  const { id, banner_id } = req.params;
  const filePath = req.file?.path;

  if (!filePath) throw new ApiError(422, "File is required.");

  const response = await uploadOnCloudinary(filePath);

  const banner = await prisma.image.update({
    where: {
      id: banner_id,
    },
    data: {
      image_url: response?.secure_url!,
      image_id: response?.public_id!,
    },
  });

  if (!banner) throw new ApiError(404, "Banner not found.");

  res.json(new ApiResponse(200, "Banner updated successfully.",  banner ));
});

export { createClash, getAllClashes, getClash, updateClashDetails, updateBanner };
