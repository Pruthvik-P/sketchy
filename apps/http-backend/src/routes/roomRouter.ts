import { createRoom, getRooms } from "../controllers/roomController";
import { Router } from "express";
import { middleware } from "../middleware/middleware";

export const roomRouter: Router = Router();

roomRouter.post("/room", middleware,createRoom);

roomRouter.get("/rooms/:roomId", getRooms)