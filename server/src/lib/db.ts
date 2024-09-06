import { prisma } from "../utils/prismaClient";

export const connectDb = async () => {
  try {
    await prisma.$connect();
    console.log("Connected to database successfully");
  } catch (err) {
    console.error(err, "err in db connection");
  }
};
