import { Response, Request } from "express";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import jwt from "jsonwebtoken";

import { loginSchema, registerSchema } from "../validators/authValidators.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import prisma from "../config/database.js";
import { renderEmailEjs } from "../helpers/renderEmailEjs.js";
import { emailQueue, emailQueueName } from "../jobs/emailJob.js";

const registerUser = asyncHandler(async (req: Request, res: Response) => {
  console.log(req.body);
  const body = req.body;
  const payload = registerSchema.parse(body);

  const existingUser = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (existingUser) {
    throw new ApiError(422, "Email already taken, please use another email.");
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  const token = await bcrypt.hash(uuid(), 10);
  const url = `${process.env.APP_URL}/auth/email-verify?token=${token}&email=${payload.email}`;

  const emailBody = await renderEmailEjs("auth/verify-email", {
    url,
    name: payload.name,
  });

  await emailQueue.add(emailQueueName, {
    to: payload.email,
    subject: "Clash email verification",
    body: emailBody,
  });

  const user = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
      email_verify_token: token,
    },
  });

  return res.json(
    new ApiResponse(
      200,
      "Please verify your email. A verification link has been sent to your email."
    )
  );
});

const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const { token, email } = req.query;

  if (!token || !email) {
    return res.redirect(`${process.env.APP_URL}/auth/email-verify-error`);
  }

  const user = await prisma.user.findUnique({
    where: {
      email: email as string,
    },
  });

  if (!user || user.email_verify_token !== token) {
    return res.redirect(`${process.env.APP_URL}/auth/email-verify-error`);
  }

  await prisma.user.update({
    where: {
      email: email as string,
    },
    data: {
      email_verify_token: null,
      email_verified_at: new Date().toISOString(),
    },
  });

  res.redirect(`${process.env.APP_URL}/auth/email-verify-success`);
});

const verifyEmailError = asyncHandler(async (req: Request, res: Response) => {
  res.render("info/verify-email-error");
});

const verifyEmailSuccess = asyncHandler(async (req: Request, res: Response) => {
  res.render("info/verify-email-success", {
    loginURL: `${process.env.CLIENT_APP_URL}/login`,
  });
});

const verifyCredentials = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body;
  const payload = loginSchema.parse(body);

  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  const isPasswordCorrect = await bcrypt.compare(
    payload.password,
    user.password
  );

  if (!isPasswordCorrect) {
    throw new ApiError(422, "Invalid credentials.");
  }

  if (!user.email_verified_at) {
    throw new ApiError(401, "Please verify your email.");
  }

  return res.json(new ApiResponse(200, "Credentials verified.", {}));
});

const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body;
  const payload = loginSchema.parse(body);

  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  console.log(user); 

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  const isPasswordCorrect = await bcrypt.compare(
    payload.password,
    user.password
  );

  if (!isPasswordCorrect) {
    throw new ApiError(422, "Invalid credentials.");
  }

  if (!user.email_verified_at) {
    throw new ApiError(401, "Please verify your email.");
  }

  const token = jwt.sign({id: user.id}, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });

  return res.json(new ApiResponse(200, "Login successful.", {
    token: `Bearer ${token}`,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },

  }));
});

export {
  registerUser,
  verifyEmail,
  verifyEmailError,
  verifyEmailSuccess,
  verifyCredentials,
  loginUser,
};
