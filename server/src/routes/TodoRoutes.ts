import { Request, Response, Router } from "express";
import { TodoController } from "../controllers/TodoController";

const TodoRouter = Router();
const todoController = new TodoController();
TodoRouter.post("/create", (req: Request, res: Response) => {
  todoController.createTodo(req, res);
});

TodoRouter.get("/getTodo", (req: Request, res: Response) => {
  todoController.getTodo(req, res);
});

TodoRouter.put("/updateTodo", (req: Request, res: Response) => {
  todoController.updateTodo(req, res);
});

TodoRouter.delete("/deleteTodo", (req: Request, res: Response) => {
  todoController.deleteTodo(req, res);
});

export default TodoRouter;
