// src/utils/prismaError.ts

import { Prisma } from "@prisma/client";
import { Response } from "express";

export const handlePrismaError = (
  err: Prisma.PrismaClientKnownRequestError,
  res: Response
) => {
  if (err.code === "P2002") {
    // Unique constraint failed
    return res.status(409).json({
      message: "Unique constraint failed: This email is already in use.",
    });
  }

  // Handle other Prisma errors if needed
  return res.status(500).json({
    message: "Prisma error occurred",
  });
};
