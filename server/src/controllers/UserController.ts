import { z } from "zod";
import { Request, response, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../utils/prismaClient";
import { handleError } from "../errors/errors";
import { NoUserError, PasswordNotMatchedError } from "../errors/userError";
import jwt from "jsonwebtoken";
import { s3Client } from "../lib/aws";
import { PutObjectCommand } from "@aws-sdk/client-s3";
const UserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4),
});

export class UserController {
  private getUserEmailFromToken(token: string | undefined): string | null {
    if (!token) return null;
    try {
      const decoded = jwt.decode(token) as { email: string } | null;
      return decoded?.email || null;
    } catch {
      return null;
    }
  }

  private async getUserByEmail(email: string | null) {
    if (!email) throw new NoUserError("User not authenticated");
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) throw new NoUserError("User does not exist");
    return user;
  }

  public async createUser(req: Request, res: Response) {
    const { email, password } = req.body;
    try {
      await UserSchema.parseAsync({
        email,
        password,
      });
      const hashedPassword = await bcrypt.hash(password, 8);
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
        },
      });

      res.status(200).json({
        data: {
          message: "User created Successfully",
        },
      });
    } catch (err) {
      handleError(err, res);
    }
  }

  public async handleSign(req: Request, res: Response) {
    const { email, password } = req.body;
    try {
      await UserSchema.parseAsync({
        email,
        password,
      });
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (!user) {
        throw new NoUserError("No user found.Please register to continue");
      }
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        throw new PasswordNotMatchedError("Invalid Password Please try again");
      }

      const token = jwt.sign(
        {
          email,
          profilePhoto: user.profilePhoto,
        },
        process.env.JWT_SECRET || ""
      );

      res.status(200).json({
        token,
        message: "Logged in Successfully",
      });
    } catch (err) {
      handleError(err, res);
    }
  }

  public async handleFileUpload(req: Request, res: Response) {
    if (!req.file) {
      return res.status(400).json({
        message: "Please send valid file",
      });
    }
    //@ts-ignore
    const token = req.token;

    const params = {
      Bucket: "clumsybot",
      Key: req.file.originalname,
      Body: req.file.buffer, // Use buffer directly instead of creating a stream
      ContentType: req.file.mimetype,
    };

    try {
      const op = await s3Client.send(new PutObjectCommand(params));
      const fileUrl = `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
      const email = this.getUserEmailFromToken(token);
      await prisma.user.update({
        where: {
          // @ts-ignore
          email,
        },
        data: {
          //@ts-ignore
          profilePhoto: fileUrl,
        },
      });

      res.status(200).send("File uploaded");
    } catch (err) {
      console.error(err);
      res.status(500).send("Failed to upload file");
    }
  }
}
