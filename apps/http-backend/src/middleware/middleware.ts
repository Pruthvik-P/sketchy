import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/secrets";
import { signInSchema } from "@repo/common/types";

interface AuthenticatedRequest extends Request {
  userId?: string;
}

export function middleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const token = req.headers["authorization"] ?? "";
  if (!token) {
    res.status(403).json({
      message: "token is required",
    });
    return;
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    req.userId = decoded.userId;
    next();
  } catch (err) {
    console.error("Error in middleware:", err);
    res.status(500).json({
      message: "Internal server error",
    });
  }
}
