import { createRoom, getRooms, getRoomSlug } from "../controllers/roomController";
import { Router } from "express";
import { middleware } from "../middleware/middleware";

export const roomRouter: Router = Router();

roomRouter.post("/room", middleware,createRoom);

roomRouter.get("/chats/:roomId", getRooms);

roomRouter.get("/room/:slug", getRoomSlug);