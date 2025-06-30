import { Request, Response } from "express";
import { createRoomSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/client";

interface CreateRoomRequest extends Request {
  userId?: string;
}

export const createRoom = async (
  req: CreateRoomRequest,
  res: Response
): Promise<any> => {
  const parsedData = createRoomSchema.safeParse(req.body);

  if (!parsedData.success) {
    res.json({
      message: "Incorrect Inputs",
    });
    return;
  }

  try {
    const existingRoom = await prismaClient.room.findFirst({
      where: {
        slug: parsedData.data.name,
      },
    });

    if (existingRoom) {
      return res.status(400).json({
        message: "Room with this name already exists",
      });
    }

    const userId = req.userId;
    if (!userId) {
      return res.status(403).json({
        message: "User ID is required",
      });
    }

    const room = await prismaClient.room.create({
      data: {
        slug: parsedData.data.name,
        adminId: userId,
      },
    });

    res.json({
      roomId: room.id,
    });
  } catch (error) {
    console.error("Error creating room:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getRooms = async (req: Request, res: Response): Promise<any> => {
  const roomId = Number(req.params.roomId);
  if (!roomId) {
    return res.status(400).json({
      message: "Room ID is required",
    });
  }

  try {
    const messages = await prismaClient.chat.findMany({
      where: {
        roomId: roomId,
      },
      orderBy: {
        id: "asc",
      },
      take: 1000,
    });

    res.json({
      messages: messages,
    });

  } catch (err) {
    console.error("Error fetching rooms:", err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getRoomSlug = async (req: Request, res: Response) =>{
  const slug = req.params.slug;
  const room = await prismaClient.room.findFirst({
    where:{
      slug
    }
  });
  res.json({
    room
  })
}
