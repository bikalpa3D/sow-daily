import prisma from "../utils/db.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

import {
  options,
  hashPassword,
  isPasswordCorrect,
  generateAccessToken,
  generateRefreshToken,
} from "../utils/index.js";

import { z } from "zod";

const userSchema = z.object({
  businessName: z.string().min(3).max(50),
  contactPerson: z.string().min(3).max(50),
  phoneNumber: z.string().min(10).max(15),
  postalNumber: z.string().min(5).max(100),
  address: z.string().min(5).max(100),
  city: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(6),
});

const generateAccessTokenAndRefreshToken = async (user) => {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user.id);

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  return { accessToken, refreshToken };
};

const register = asyncHandler(async (req, res) => {
  const { businessName, email, password } = req.body;

  const result = userSchema.safeParse(req.body);
  console.log(result);

  if (
    [businessName, email, password].some(
      (field) => !field || field.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { businessName: businessName.toLowerCase() },
        { email: email.toLowerCase() },
      ],
    },
  });

  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }

  const hashedPassword = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      businessName: businessName.toLowerCase(),
      email: email.toLowerCase(),
      password: hashedPassword,
    },
  });

  res.status(201).json(new ApiResponse(201, user, "User created"));
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) {
    throw new ApiError(400, "User not found");
  }

  const isValidPassword = await isPasswordCorrect(password, user.password);
  if (!isValidPassword) {
    throw new ApiError(400, "Invalid password");
  }

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user);

  const loggedInUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      businessName: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  };

  res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in"
      )
    );
});

const logout = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  await prisma.user.update({
    where: { id: userId },
    data: { refreshToken: null },
  });

  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"));
});

const getMe = asyncHandler(async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new ApiError(401, "User ID not found in request");
  }

  const user = await prisma.user.findFirst({
    where: { id: userId },
    select: {
      id: true,
      businessName: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  res.status(200).json(new ApiResponse(200, user, "User details"));
});

export { register, login, logout, getMe };
