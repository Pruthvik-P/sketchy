'use client';

import { useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';

interface DrawingCanvasProps {
  roomId: string;
  currentUser: {
    id: string;
    name: string;
    color: string;
  };
  socket: Socket | null;
  selectedTool: string;
  strokeColor: string;
  strokeWidth: number;
}

interface DrawingPath {
  id: string;
  tool: string;
  color: string;
  width: number;
  points: { x: number; y: number }[];
  userId: string;
}

export function DrawingCanvas({
  roomId,
  currentUser,
  socket,
  selectedTool,
  strokeColor,
  strokeWidth,
}: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [paths, setPaths] = useState<DrawingPath[]>([]);
  const [currentPath, setCurrentPath] = useState<DrawingPath | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      
      // Redraw all paths
      redrawCanvas();
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    // Listen for drawing data from other users
    socket.on('drawing-update', (pathData: DrawingPath) => {
      if (pathData.userId !== currentUser.id) {
        setPaths(prev => {
          const existingIndex = prev.findIndex(p => p.id === pathData.id);
          if (existingIndex >= 0) {
            const newPaths = [...prev];
            newPaths[existingIndex] = pathData;
            return newPaths;
          }
          return [...prev, pathData];
        });
      }
    });

    socket.on('drawing-complete', (pathData: DrawingPath) => {
      if (pathData.userId !== currentUser.id) {
        setPaths(prev => {
          const existingIndex = prev.findIndex(p => p.id === pathData.id);
          if (existingIndex >= 0) {
            const newPaths = [...prev];
            newPaths[existingIndex] = pathData;
            return newPaths;
          }
          return [...prev, pathData];
        });
      }
    });

    return () => {
      socket.off('drawing-update');
      socket.off('drawing-complete');
    };
  }, [socket, currentUser.id]);

  useEffect(() => {
    redrawCanvas();
  }, [paths, currentPath]);

  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw all completed paths
    [...paths, currentPath].filter(Boolean).forEach(path => {
      if (!path || path.points.length < 2) return;

      ctx.beginPath();
      ctx.strokeStyle = path.color;
      ctx.lineWidth = path.width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (path.tool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
      } else {
        ctx.globalCompositeOperation = 'source-over';
      }

      ctx.moveTo(path.points[0].x, path.points[0].y);
      for (let i = 1; i < path.points.length; i++) {
        ctx.lineTo(path.points[i].x, path.points[i].y);
      }
      ctx.stroke();
    });

    ctx.globalCompositeOperation = 'source-over';
  };

  const getCanvasPoint = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent) => {
    if (selectedTool === 'select') return;

    setIsDrawing(true);
    const point = getCanvasPoint(e);
    
    const newPath: DrawingPath = {
      id: `${currentUser.id}-${Date.now()}`,
      tool: selectedTool,
      color: selectedTool === 'eraser' ? strokeColor : strokeColor,
      width: selectedTool === 'eraser' ? strokeWidth * 2 : strokeWidth,
      points: [point],
      userId: currentUser.id,
    };

    setCurrentPath(newPath);

    // Emit to socket
    if (socket) {
      socket.emit('drawing-start', {
        roomId,
        pathData: newPath,
      });
    }
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing || !currentPath) return;

    const point = getCanvasPoint(e);
    const updatedPath = {
      ...currentPath,
      points: [...currentPath.points, point],
    };

    setCurrentPath(updatedPath);

    // Emit to socket (throttled)
    if (socket && updatedPath.points.length % 3 === 0) {
      socket.emit('drawing-update', {
        roomId,
        pathData: updatedPath,
      });
    }

    // Send cursor position
    if (socket) {
      socket.emit('cursor-move', {
        roomId,
        userId: currentUser.id,
        cursor: point,
      });
    }
  };

  const stopDrawing = () => {
    if (!isDrawing || !currentPath) return;

    setIsDrawing(false);
    
    // Add to paths
    setPaths(prev => [...prev, currentPath]);
    
    // Emit final path to socket
    if (socket) {
      socket.emit('drawing-complete', {
        roomId,
        pathData: currentPath,
      });
    }

    setCurrentPath(null);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDrawing) {
      draw(e);
    } else if (socket) {
      // Send cursor position even when not drawing
      const point = getCanvasPoint(e);
      socket.emit('cursor-move', {
        roomId,
        userId: currentUser.id,
        cursor: point,
      });
    }
  };

  const clearCanvas = () => {
    setPaths([]);
    setCurrentPath(null);
    
    if (socket) {
      socket.emit('canvas-clear', { roomId });
    }
  };

  return (
    <div className="w-full h-full relative bg-white dark:bg-gray-900">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-crosshair"
        onMouseDown={startDrawing}
        onMouseMove={handleMouseMove}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
      
      {/* Canvas controls */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <div className="bg-background/90 backdrop-blur-sm border rounded-lg p-2 flex items-center gap-2">
          <button
            onClick={clearCanvas}
            className="px-3 py-1 text-sm bg-destructive text-destructive-foreground rounded hover:bg-destructive/90 transition-colors"
          >
            Clear
          </button>
          <div className="text-sm text-muted-foreground">
            {paths.length} paths
          </div>
        </div>
      </div>
    </div>
  );
}