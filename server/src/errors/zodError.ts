// src/utils/zodError.ts

import { ZodError } from "zod";
import { Response } from "express";

export const handleZodError = (err: ZodError, res: Response) => {
  return res.status(400).json({
    message: "Validation error",
    errors: err.errors,
  });
};
