import ApiError from "../utils/ApiError";
import prisma from "../utils/db.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getLanguages = asyncHandler(async (req, res) => {
  const { langCode } = req.params;

  const language = await prisma.language.findUnique({
    where: { code: langCode },
    include: { translations: true },
  });

  if (!language) {
    throw new ApiError(404, "Language not found");
  }

  const result = language.translations.reduce((acc, t) => {
    acc[t.key] = t.value;
    return acc;
  }, {});

  res.json(new ApiResponse(200, result, "Translations fetched successfully"));
});
