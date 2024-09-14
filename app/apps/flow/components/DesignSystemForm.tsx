// /root/app/apps/flow/components/DesignSystemForm.tsx

import React, { useState } from "react";
import { DesignSystem } from "@prisma/client";

interface DesignSystemFormProps {
  onCreate: (
    system: Omit<DesignSystem, "id" | "createdAt" | "updatedAt" | "profileId">
  ) => Promise<void>;
}

export default function DesignSystemForm({ onCreate }: DesignSystemFormProps) {
  const [name, setName] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#000000");
  const [secondaryColor, setSecondaryColor] = useState("#ffffff");
  const [backgroundColor, setBackgroundColor] = useState(
    "rgba(47, 47, 47, 0.5)"
  );
  const [editorBackground, setEditorBackground] =
    useState("rgba(0, 0, 0, 0.5)");
  const [primaryFont, setPrimaryFont] = useState("");
  const [secondaryFont, setSecondaryFont] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onCreate({
      name,
      primaryColor,
      secondaryColor,
      backgroundColor,
      editorBackground,
      primaryFont,
      secondaryFont,
    });
    // Reset form
    setName("");
    setPrimaryColor("#000000");
    setSecondaryColor("#ffffff");
    setBackgroundColor("rgba(47, 47, 47, 0.5)");
    setEditorBackground("rgba(0, 0, 0, 0.5)");
    setPrimaryFont("");
    setSecondaryFont("");
  };

  const handleFontUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setFont: (font: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("font", file);
      try {
        const response = await fetch("/api/upload-font", {
          method: "POST",
          body: formData,
        });
        if (response.ok) {
          const data = await response.json();
          setFont(data.fileName);
        }
      } catch (error) {
        console.error("Error uploading font:", error);
      }
    }
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
      <div>
        <label>Primary Color:</label>
        <input
          type="color"
          value={primaryColor}
          onChange={(e) => setPrimaryColor(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label>Secondary Color:</label>
        <input
          type="color"
          value={secondaryColor}
          onChange={(e) => setSecondaryColor(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label>Background Color:</label>
        <input
          type="text"
          value={backgroundColor}
          onChange={(e) => setBackgroundColor(e.target.value)}
          placeholder="rgba(47, 47, 47, 0.5)"
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label>Editor Background:</label>
        <input
          type="text"
          value={editorBackground}
          onChange={(e) => setEditorBackground(e.target.value)}
          placeholder="rgba(0, 0, 0, 0.5)"
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label>Primary Font:</label>
        <input
          type="file"
          accept=".ttf,.otf,.woff,.woff2"
          onChange={(e) => handleFontUpload(e, setPrimaryFont)}
          className="w-full p-2 border rounded"
        />
        {primaryFont && <p>Uploaded: {primaryFont}</p>}
      </div>
      <div>
        <label>Secondary Font:</label>
        <input
          type="file"
          accept=".ttf,.otf,.woff,.woff2"
          onChange={(e) => handleFontUpload(e, setSecondaryFont)}
          className="w-full p-2 border rounded"
        />
        {secondaryFont && <p>Uploaded: {secondaryFont}</p>}
      </div>
      <button
        type="submit"
        className="w-full p-2 bg-blue-500 text-white rounded"
      >
        Create Design System
      </button>
    </form>
  );
}
