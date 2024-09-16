import React, { useState, useCallback, useRef, useEffect } from "react";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label: string;
}

export default function ColorPicker({
  color,
  onChange,
  label,
}: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localColor, setLocalColor] = useState(color);
  const [opacity, setOpacity] = useState(1);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalColor(color);
    setOpacity(parseInt(color.slice(-2), 16) / 255);
  }, [color]);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        onChange(localColor);
      }
    },
    [localColor, onChange]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, handleClickOutside]);

  const handleColorChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newColor =
        e.target.value +
        Math.round(opacity * 255)
          .toString(16)
          .padStart(2, "0");
      setLocalColor(newColor);
    },
    [opacity]
  );

  const handleOpacityChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newOpacity = parseFloat(e.target.value);
      setOpacity(newOpacity);
      setLocalColor(
        (prevColor) =>
          prevColor.slice(0, 7) +
          Math.round(newOpacity * 255)
            .toString(16)
            .padStart(2, "0")
      );
    },
    []
  );

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 rounded-full border border-gray-300"
        style={{ backgroundColor: localColor }}
        title={label}
      />
      {isOpen && (
        <div
          ref={pickerRef}
          className="absolute z-10 mt-2 p-4 bg-white rounded shadow-lg"
        >
          <label className="block mb-2 text-sm font-medium">{label}</label>
          <input
            type="color"
            value={localColor.slice(0, 7)}
            onChange={handleColorChange}
            className="w-full h-10 mb-4"
          />
          <div className="flex flex-col">
            <label className="mb-1 text-sm">
              Opacity: {Math.round(opacity * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={opacity}
              onChange={handleOpacityChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  );
}
