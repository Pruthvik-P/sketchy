
import { RoomCanvas } from "@/components/draw/RoomCanvas"

export default function CanvasPage({params}:{
  params: {
    roomId: string
  }
}) {
  const roomId = params.roomId
  console.log(roomId)
  return <div>
    
    <RoomCanvas roomId={roomId} roomToken={"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzYWJiOTk3ZC00ZTljLTRlOGQtYjJjMi04NWMxZjlhZGU0MjEiLCJpYXQiOjE3NTEyMTg5ODF9.2PiNMHsrz4xJTqN5SswCgfiauUEO8wmucYRVNbje5Jo"}/>


  </div>
  
}
