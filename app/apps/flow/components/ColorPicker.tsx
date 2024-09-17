// /app/flow/components/ColorPicker.tsx

import React, { useState, useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { RgbaColorPicker, RgbaColor } from "react-colorful";
import debounce from "lodash/debounce";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label: string;
}

const hexToRgba = (hex: string): RgbaColor => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const a = parseInt(hex.slice(7, 9), 16) / 255 || 1;
  return { r, g, b, a };
};

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
  const [inputValue, setInputValue] = useState(color.toUpperCase());
  const colorPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalColor(hexToRgba(color));
    setInputValue(color.toUpperCase());
  }, [color]);

  const debouncedOnChange = useCallback(
    debounce((newColor: string) => {
      onChange(newColor);
    }, 300),
    [onChange]
  );

  const handleColorChange = (newColor: RgbaColor) => {
    setLocalColor(newColor);
    const newHexColor = rgbaToHex(newColor);
    setInputValue(newHexColor.toUpperCase());
    debouncedOnChange(newHexColor);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
  };

  const handleInputBlur = () => {
    const hexRegex = /^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/;
    if (hexRegex.test(inputValue)) {
      let hexValue = inputValue.startsWith("#") ? inputValue : `#${inputValue}`;
      if (hexValue.length === 4) {
        hexValue = `#${hexValue[1]}${hexValue[1]}${hexValue[2]}${hexValue[2]}${hexValue[3]}${hexValue[3]}`;
      }
      if (hexValue.length === 7) {
        hexValue = `${hexValue}FF`;
      }
      const newColor = hexToRgba(hexValue);
      setLocalColor(newColor);
      setInputValue(hexValue.toUpperCase());
      debouncedOnChange(hexValue);
    } else {
      setInputValue(rgbaToHex(localColor).toUpperCase());
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        colorPickerRef.current &&
        !colorPickerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block" ref={colorPickerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 rounded shadow"
        style={{ backgroundColor: rgbaToHex(localColor) }}
      />
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute z-10 mt-2 p-4 bg-zinc-800 rounded shadow-lg"
        >
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
                    onChange={(e) => {
                      const value = Math.min(
                        255,
                        Math.max(0, parseInt(e.target.value) || 0)
                      );
                      handleColorChange({
                        ...localColor,
                        [component]: value,
                      });
                    }}
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
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              className="flex-grow px-2 py-1 text-xs bg-zinc-700 text-white rounded"
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}
