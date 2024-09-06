import { Response } from "express";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { handlePrismaError } from "./prismaError";
import { handleZodError } from "./zodError";
import { NoUserError, PasswordNotMatchedError } from "./userError";

export const handleError = (err: any, res: Response) => {
  if (err instanceof ZodError) {
    // Handle Zod validation errors
    return handleZodError(err, res);
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Handle Prisma errors
    return handlePrismaError(err, res);
  }

  // Handle other known errors (e.g., custom errors)
  if (err instanceof NoUserError) {
    return res.status(422).json({
      message: err.message,
    });
  }

  if (err instanceof PasswordNotMatchedError) {
    return res.status(401).json({
      message: err.message,
    });
  }

  // Fallback for unknown errors
  console.error(err);
  return res.status(500).json({
    message: "Internal server error",
  });
};
