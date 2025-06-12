import { createUser, signIn } from "../controllers/userController";
import { Router, Request, Response, NextFunction } from "express";

export const userRouter: Router = Router();

userRouter.post("/signup", createUser);
userRouter.post("/signin", signIn);

