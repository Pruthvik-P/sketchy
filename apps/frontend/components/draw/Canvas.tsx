import { useEffect, useRef } from "react";
import { initDraw } from "@/app/draw";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";


export function Canvas({roomId, socket}: {roomId: string, socket: WebSocket}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

   useEffect(() => {
    if (canvasRef.current) {
      initDraw(canvasRef.current, roomId, socket);
    }
  }, [canvasRef]);

  return <div>
    {/* <TransformWrapper>
      <TransformComponent> */}
      <canvas
      ref={canvasRef}
      width={2000}
      height={1000}
      className="bg-white"
    ></canvas>
    {/* </TransformComponent>
        </TransformWrapper> */}
  </div>
}