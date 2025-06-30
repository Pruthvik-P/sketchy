"use client";

import { useEffect, useState } from "react";
import { WS_URL } from "@/config";
import { Canvas } from "./Canvas";


export function RoomCanvas({roomId, roomToken}: {roomId: string, roomToken: string}){

const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(()=>{
    const ws = new WebSocket(`${WS_URL}?token=${roomToken}`);

    ws.onopen = () =>{
      setSocket(ws);
      ws.send(JSON.stringify({
        type: "join_room",
        roomId
      }))
    }
  }, [roomId])

 

  if(!socket){
    return <div>
    Connecting to server...</div>
  }
  return (
    <div>
      <Canvas roomId={roomId} socket={socket}/>
    </div>
     
  );
}