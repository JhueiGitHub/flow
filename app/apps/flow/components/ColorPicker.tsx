// app/flow/components/ColorPicker.tsx

import React, { useState, useEffect, useCallback } from "react";

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

  useEffect(() => {
    setLocalColor(color);
    setOpacity(parseInt(color.slice(-2), 16) / 255);
  }, [color]);

  // This function is responsible for detecting changes in the color input
  const handleColorChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newColor =
        e.target.value +
        Math.round(opacity * 255)
          .toString(16)
          .padStart(2, "0");
      setLocalColor(newColor);
      onChange(newColor); // This line updates the parent component
    },
    [opacity, onChange]
  );

  // This function handles changes in the opacity slider
  const handleOpacityChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newOpacity = parseFloat(e.target.value);
      setOpacity(newOpacity);
      const newColor =
        localColor.slice(0, 7) +
        Math.round(newOpacity * 255)
          .toString(16)
          .padStart(2, "0");
      setLocalColor(newColor);
      onChange(newColor); // This line updates the parent component
    },
    [localColor, onChange]
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
        <div className="ColorPicker h-72 p-2 bg-zinc-800 rounded shadow border border-zinc-700 flex-col justify-center items-center gap-2 inline-flex">
          <div className="ColorWheel w-44 h-44 relative">
            <div className="Rectangle648 w-44 h-44 left-0 top-0 absolute bg-zinc-300 rounded" />
            {/* TODO: Implement actual color wheel functionality */}
          </div>
          <div className="PreviewAndSlides w-44 justify-between items-center inline-flex">
            <div
              className="Preview p-2.5 rounded"
              style={{ backgroundColor: localColor }}
            />
            <div className="Sliders w-36 self-stretch flex-col justify-start items-start gap-2 inline-flex">
              <div className="ColorSlider self-stretch h-2.5 justify-start items-start gap-2 inline-flex">
                <input
                  type="color"
                  value={localColor.slice(0, 7)}
                  onChange={handleColorChange}
                  className="w-full h-2.5 bg-gradient-to-r from-red-600 via-orange-500 to-red-600 rounded-full appearance-none"
                />
              </div>
              <div className="TransparencySlider self-stretch h-2.5 justify-start items-start gap-2 inline-flex">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={opacity}
                  onChange={handleOpacityChange}
                  className="w-full h-2.5 bg-gradient-to-r from-black to-violet-700 rounded-full appearance-none"
                />
              </div>
            </div>
          </div>
          <div className="HexRgb justify-center items-center gap-2 inline-flex">
            <div className="Hex w-14 flex-col justify-start items-start gap-1 inline-flex">
              <div className="Hex self-stretch text-neutral-50 text-xs font-medium font-['Inter']">
                HEX
              </div>
              <input
                className="Input self-stretch px-2 py-1 bg-zinc-700 rounded text-neutral-50 text-xs font-normal font-['Inter'] leading-tight tracking-tight"
                value={localColor.slice(0, 7)}
                onChange={(e) =>
                  handleColorChange({
                    target: { value: e.target.value },
                  } as React.ChangeEvent<HTMLInputElement>)
                }
              />
            </div>
            <div className="Rgb justify-start items-start gap-px flex">
              {["r", "g", "b"].map((component, index) => {
                const value = parseInt(
                  localColor.slice(1 + index * 2, 3 + index * 2),
                  16
                );
                return (
                  <div
                    key={component}
                    className="Value w-9 flex-col justify-start items-start gap-1 inline-flex"
                  >
                    <div
                      className={`${component.toUpperCase()} self-stretch text-neutral-50 text-xs font-medium font-['Inter']`}
                    >
                      {component.toUpperCase()}
                    </div>
                    <input
                      className={`Input self-stretch px-2 py-1 bg-zinc-700 text-neutral-50 text-xs font-normal font-['Inter'] leading-tight tracking-tight ${
                        index === 0
                          ? "rounded-tl rounded-bl"
                          : index === 2
                          ? "rounded-tr rounded-br"
                          : ""
                      }`}
                      value={value}
                      onChange={(e) => {
                        const newValue = Math.max(
                          0,
                          Math.min(255, parseInt(e.target.value) || 0)
                        );
                        const newColor =
                          localColor.slice(0, 1 + index * 2) +
                          newValue.toString(16).padStart(2, "0") +
                          localColor.slice(3 + index * 2);
                        handleColorChange({
                          target: { value: newColor },
                        } as React.ChangeEvent<HTMLInputElement>);
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
