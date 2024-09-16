// app/flow/components/ColorPicker.tsx

import React, { useState, useCallback } from "react";
import { RgbaColorPicker, RgbaColor } from "react-colorful";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label: string;
}

// Helper function to convert hex to rgba
const hexToRgba = (hex: string): RgbaColor => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const a = parseInt(hex.slice(7, 9), 16) / 255;
  return { r, g, b, a };
};

// Helper function to convert rgba to hex
const rgbaToHex = ({ r, g, b, a }: RgbaColor): string => {
  return `#${[r, g, b, Math.round(a * 255)]
    .map((x) => x.toString(16).padStart(2, "0"))
    .join("")}`;
};

export default function ColorPicker({
  color,
  onChange,
  label,
}: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localColor, setLocalColor] = useState<RgbaColor>(hexToRgba(color));

  // Handle color change from the picker
  const handleColorChange = useCallback(
    (newColor: RgbaColor) => {
      setLocalColor(newColor);
      onChange(rgbaToHex(newColor));
    },
    [onChange]
  );

  // Handle manual input for RGB values
  const handleRgbChange = (component: "r" | "g" | "b", value: string) => {
    const numValue = Math.min(255, Math.max(0, parseInt(value) || 0));
    handleColorChange({ ...localColor, [component]: numValue });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 rounded-full border border-gray-300"
        style={{ backgroundColor: rgbaToHex(localColor) }}
        title={label}
      />
      {isOpen && (
        <div className="absolute z-10 mt-2 p-4 bg-zinc-800 rounded-lg shadow-lg border border-zinc-700">
          <div className="mb-4">
            <RgbaColorPicker color={localColor} onChange={handleColorChange} />
          </div>
          <div className="flex items-center justify-between mb-2">
            <div
              className="w-8 h-8 rounded-full border border-gray-300"
              style={{ backgroundColor: rgbaToHex(localColor) }}
            />
            <div className="flex space-x-2">
              {["r", "g", "b"].map((component) => (
                <div key={component} className="flex flex-col items-center">
                  <label className="text-xs text-white mb-1">
                    {component.toUpperCase()}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="255"
                    value={localColor[component as "r" | "g" | "b"]}
                    onChange={(e) =>
                      handleRgbChange(
                        component as "r" | "g" | "b",
                        e.target.value
                      )
                    }
                    className="w-12 px-1 py-0.5 text-xs bg-zinc-700 text-white rounded"
                  />
                </div>
              ))}
              <div className="flex flex-col items-center">
                <label className="text-xs text-white mb-1">A</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={Math.round(localColor.a * 100)}
                  onChange={(e) =>
                    handleColorChange({
                      ...localColor,
                      a: parseInt(e.target.value) / 100,
                    })
                  }
                  className="w-12 px-1 py-0.5 text-xs bg-zinc-700 text-white rounded"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <label className="text-xs text-white mr-2">HEX</label>
            <input
              type="text"
              value={rgbaToHex(localColor).toUpperCase()}
              onChange={(e) => {
                const hex = e.target.value;
                if (/^#[0-9A-Fa-f]{6,8}$/.test(hex)) {
                  handleColorChange(hexToRgba(hex.padEnd(9, "F")));
                }
              }}
              className="flex-grow px-2 py-1 text-xs bg-zinc-700 text-white rounded"
            />
          </div>
        </div>
      )}
    </div>
  );
}
