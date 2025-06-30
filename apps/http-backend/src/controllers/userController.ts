import { createUserSchema, signInSchema } from "@repo/common/types";
import { Request, Response, NextFunction } from "express";
import { prismaClient } from "@repo/db/client";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/secrets";
import bcrypt from "bcrypt";

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
):Promise<any> => {
  const parseData = createUserSchema.safeParse(req.body);
  if (!parseData.success) {
    console.log(parseData.error);
    res.json({ error: "Invalid data" });
  }
  const existingUser = await prismaClient.user.findFirst({
    where: {
      email: parseData.data!.email,
    },
  });
  if (existingUser) {
    return res.status(400).json({ error: "User already exists" });
  }
  try {
    const hashedPassword = await bcrypt.hash(parseData.data!.password, 10);
    const user = await prismaClient.user.create({
      data: {
        email: parseData.data!.email,
        password: hashedPassword,
        name: parseData.data!.name,
      },
    });
    return res.json({
      userId: user.id,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const signIn = async (
  req: Request,
  res: Response,
  next: NextFunction
):Promise<any> => {
  const parseData = signInSchema.safeParse(req.body);
  if (!parseData.success) {
    console.log(parseData.error);
    res.json({ error: "Invalid data" });
  }
  try {
    const user = await prismaClient.user.findFirst({
      where: {
        email: parseData.data!.email,
      },
    });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
    const isPassowrdValid = await bcrypt.compare(
      parseData.data!.password,
      user.password
    );
    if (!isPassowrdValid) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
      {
        userId: user.id,
      },
      JWT_SECRET
    );

    res.json({
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
