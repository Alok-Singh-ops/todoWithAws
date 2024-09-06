import { PrismaClient } from "@prisma/client";
import express from "express";
import { connectDb } from "./lib/db";
import UserRouter from "./routes/UserRoutes";
import TodoRouter from "./routes/TodoRoutes";
import { todoMiddleware } from "./middlewares/todoMiddleware";
import cors from "cors";
const app = express();
const PORT = 8080 || process.env.PORT;
const prisma = new PrismaClient();

connectDb();
app.use(express.json());
app.use(cors());
app.use("/user", UserRouter);
app.use("/todo", todoMiddleware, TodoRouter);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "ok",
  });
});

app.listen(PORT, () => {
  console.log(`Server started listening to port ${PORT}`);
});
