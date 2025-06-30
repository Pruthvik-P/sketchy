'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Pencil,
  Brush,
  Eraser,
  Square,
  Circle,
  Triangle,
  Type,
  MousePointer,
  Palette,
  Minus,
} from 'lucide-react';

interface ToolbarProps {
  selectedTool: string;
  onToolChange: (tool: string) => void;
  strokeColor: string;
  onStrokeColorChange: (color: string) => void;
  strokeWidth: number;
  onStrokeWidthChange: (width: number) => void;
}

const tools = [
  { id: 'select', icon: MousePointer, label: 'Select' },
  { id: 'pen', icon: Pencil, label: 'Pen' },
  { id: 'brush', icon: Brush, label: 'Brush' },
  { id: 'eraser', icon: Eraser, label: 'Eraser' },
  { id: 'line', icon: Minus, label: 'Line' },
  { id: 'rectangle', icon: Square, label: 'Rectangle' },
  { id: 'circle', icon: Circle, label: 'Circle' },
  { id: 'text', icon: Type, label: 'Text' },
];

const colors = [
  '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
  '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080',
  '#FFC0CB', '#A52A2A', '#808080', '#000080', '#008000',
];

export function Toolbar({
  selectedTool,
  onToolChange,
  strokeColor,
  onStrokeColorChange,
  strokeWidth,
  onStrokeWidthChange,
}: ToolbarProps) {
  return (
    <div className="flex flex-col p-2 space-y-2">
      {/* Tools */}
      <div className="space-y-1">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Button
              key={tool.id}
              variant={selectedTool === tool.id ? 'default' : 'ghost'}
              size="icon"
              onClick={() => onToolChange(tool.id)}
              className="w-12 h-12"
              title={tool.label}
            >
              <Icon className="w-5 h-5" />
            </Button>
          );
        })}
      </div>

      <Separator />

      {/* Color Picker */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="w-12 h-12 relative"
            title="Color"
          >
            <Palette className="w-5 h-5" />
            <div
              className="absolute bottom-1 right-1 w-3 h-3 rounded-full border border-white"
              style={{ backgroundColor: strokeColor }}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent side="right" className="w-48">
          <div className="grid grid-cols-5 gap-2">
            {colors.map((color) => (
              <button
                key={color}
                className={`w-8 h-8 rounded border-2 transition-transform hover:scale-110 ${
                  strokeColor === color ? 'border-primary scale-110' : 'border-gray-300'
                }`}
                style={{ backgroundColor: color }}
                onClick={() => onStrokeColorChange(color)}
              />
            ))}
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Custom Color</label>
            <input
              type="color"
              value={strokeColor}
              onChange={(e) => onStrokeColorChange(e.target.value)}
              className="w-full h-8 rounded border"
            />
          </div>
        </PopoverContent>
      </Popover>

      {/* Stroke Width */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="w-12 h-12 flex flex-col"
            title="Stroke Width"
          >
            <div className="flex flex-col items-center space-y-1">
              <div
                className="rounded-full bg-current"
                style={{
                  width: Math.max(2, strokeWidth),
                  height: Math.max(2, strokeWidth),
                }}
              />
              <span className="text-xs">{strokeWidth}</span>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent side="right" className="w-48">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Stroke Width</label>
              <Slider
                value={[strokeWidth]}
                onValueChange={(value) => onStrokeWidthChange(value[0])}
                max={20}
                min={1}
                step={1}
                className="w-full"
              />
            </div>
            
            <div className="flex justify-center">
              <div
                className="rounded-full bg-current"
                style={{
                  width: strokeWidth * 2,
                  height: strokeWidth * 2,
                }}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}