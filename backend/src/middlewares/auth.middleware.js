
import prisma from "../utils/db.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../constant.js";

const verifyJwt = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.headers?.authorization?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized");
    }

    const decodedToken = jwt.verify(token, ACCESS_TOKEN_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decodedToken?.id },
      select: {
        id: true,
        businessName: true,
        email: true,
        createdAt: true,
        updatedAt: true,

      },
    });

    if (!user) {
      throw new ApiError(401, "Unauthorized or the token has expired");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(
      401,
      error.message || "Unauthorized or the token has expired"
    );
  }
});


export { verifyJwt };
