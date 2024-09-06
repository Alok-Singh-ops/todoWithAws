import { Router } from "express";
import { UserController } from "../controllers/UserController";
import multer from "multer";
import { userMiddleware } from "../middlewares/userMiddleware";

const UserRouter = Router();
const userController = new UserController();

UserRouter.post("/register", async (req, res) => {
  userController.createUser(req, res);
});

UserRouter.post("/signIn", async (req, res) => {
  userController.handleSign(req, res);
});

// Use memoryStorage to store the file in memory as a buffer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
UserRouter.post(
  "/uploadProfilePic",
  upload.single("file"),
  userMiddleware,
  async (req, res) => {
    userController.handleFileUpload(req, res);
  }
);

export default UserRouter;
