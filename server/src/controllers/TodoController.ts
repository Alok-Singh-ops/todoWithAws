import { Request, Response } from "express";
import { prisma } from "../utils/prismaClient";
import jwt from "jsonwebtoken";
import { NoUserError } from "../errors/userError";

export class TodoController {
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

  public async createTodo(req: Request, res: Response) {
    //@ts-ignore
    const token = req?.token;
    const email = this.getUserEmailFromToken(token);
    const { title, description } = req.body;
    try {
      const user = await this.getUserByEmail(email);
      const todo = await prisma.todo.create({
        data: {
          title,
          description,
          userId: user.id,
        },
      });

      res.status(200).json({ data: "Todo created successfully", todo });
    } catch (error) {
      console.error(error);
      //@ts-ignore
      res.status(500).json({ error: error.message });
    }
  }

  public async getTodo(req: Request, res: Response) {
    //@ts-ignore
    const token = req?.token;
    const email = this.getUserEmailFromToken(token);
    try {
      const user = await this.getUserByEmail(email);
      const todos = await prisma.todo.findMany({
        where: {
          userId: user.id,
          isDeleted: false,
        },
      });
      if (todos.length > 0) {
        res.status(200).json(todos);
      } else {
        res.status(404).json({ message: "No todos found for this user" });
      }
    } catch (error) {
      console.error(error);
      //@ts-ignore
      res.status(500).json({ error: error.message });
    }
  }

  public async updateTodo(req: Request, res: Response) {
    //@ts-ignore
    const { id, isDone } = req.body;
    try {
      const updatedTodo = await prisma.todo.update({
        where: {
          id,
        },
        data: {
          isDone,
        },
      });
      res.status(200).json({
        updatedTodo,
      });
    } catch (err) {
      res.status(402).json({
        message: "Something went wrong",
      });
    }
  }

  public async deleteTodo(req: Request, res: Response) {
    const id = req.body;
    await prisma.todo.update({
      where: {
        id,
      },
      data: {
        // @ts-ignore
        iDeleted: true,
      },
    });
  }
}
