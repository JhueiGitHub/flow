// app/flow/components/DesignSystemForm.tsx

/*
Functionality:
- Provides a form for creating new design systems
- Includes inputs for all design system properties
- Utilizes the custom ColorPicker component for color selection
- Handles form submission and passes the new design system data to the parent component
*/

import React, { useState } from "react";
import { DesignSystem } from "@prisma/client";
import ColorPicker from "./ColorPicker";

interface DesignSystemFormProps {
  onSubmit: (newSystem: Partial<DesignSystem>) => Promise<void>;
}

export default function DesignSystemForm({ onSubmit }: DesignSystemFormProps) {
  const [name, setName] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#000000");
  const [secondaryColor, setSecondaryColor] = useState("#FFFFFF");
  const [backgroundColor, setBackgroundColor] = useState("#F0F0F0");
  const [overlayBackground, setOverlayBackground] = useState("#00000080");
  const [overlayBorder, setOverlayBorder] = useState("#FFFFFF40");
  const [textPrimary, setTextPrimary] = useState("#000000");
  const [accentColor, setAccentColor] = useState("#0000FF");
  const [textAccentColor, setTextAccentColor] = useState("#FF0000");
  const [primaryFont, setPrimaryFont] = useState("Arial");
  const [secondaryFont, setSecondaryFont] = useState("Helvetica");
  const [editorBackground, setEditorBackground] = useState("#FFFFFF");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newSystem: Partial<DesignSystem> = {
      name,
      primaryColor,
      secondaryColor,
      backgroundColor,
      overlayBackground,
      overlayBorder,
      textPrimary,
      accentColor,
      textAccentColor,
      primaryFont,
      secondaryFont,
      editorBackground,
    };
    await onSubmit(newSystem);
    // Reset form
    setName("");
    setPrimaryColor("#000000");
    setSecondaryColor("#FFFFFF");
    setBackgroundColor("#F0F0F0");
    setOverlayBackground("#00000080");
    setOverlayBorder("#FFFFFF40");
    setTextPrimary("#000000");
    setAccentColor("#0000FF");
    setTextAccentColor("#FF0000");
    setPrimaryFont("Arial");
    setSecondaryFont("Helvetica");
    setEditorBackground("#FFFFFF");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Design System Name"
        className="w-full p-2 border rounded"
        required
      />
      <ColorPicker
        color={primaryColor}
        onChange={setPrimaryColor}
        label="Primary Color"
      />
      <ColorPicker
        color={secondaryColor}
        onChange={setSecondaryColor}
        label="Secondary Color"
      />
      <ColorPicker
        color={backgroundColor}
        onChange={setBackgroundColor}
        label="Background Color"
      />
      <ColorPicker
        color={overlayBackground}
        onChange={setOverlayBackground}
        label="Overlay Background"
      />
      <ColorPicker
        color={overlayBorder}
        onChange={setOverlayBorder}
        label="Overlay Border"
      />
      <ColorPicker
        color={textPrimary}
        onChange={setTextPrimary}
        label="Text Primary"
      />
      <ColorPicker
        color={accentColor}
        onChange={setAccentColor}
        label="Accent Color"
      />
      <ColorPicker
        color={textAccentColor}
        onChange={setTextAccentColor}
        label="Text Accent Color"
      />
      <ColorPicker
        color={editorBackground}
        onChange={setEditorBackground}
        label="Editor Background"
      />
      <input
        type="text"
        value={primaryFont}
        onChange={(e) => setPrimaryFont(e.target.value)}
        placeholder="Primary Font"
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="text"
        value={secondaryFont}
        onChange={(e) => setSecondaryFont(e.target.value)}
        placeholder="Secondary Font"
        className="w-full p-2 border rounded"
        required
      />
      <button
        type="submit"
        className="w-full p-2 bg-blue-500 text-white rounded"
      >
        Create Design System
      </button>
    </form>
  );
}
