import { createUser, signIn } from "../controllers/userController";
import { Router, Request, Response, NextFunction } from "express";

export const userRouter: Router = Router();

userRouter.post("/auth/signup", createUser);
userRouter.post("/auth/signin", signIn);

