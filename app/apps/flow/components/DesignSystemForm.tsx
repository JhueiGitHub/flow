// /root/app/flow/components/DesignSystemForm.tsx

import React, { useState } from "react";
import { DesignSystem } from "@prisma/client";

interface DesignSystemFormProps {
  onCreate: (
    system: Omit<DesignSystem, "id" | "createdAt" | "updatedAt"> & {
      editorBackground: string;
    }
  ) => Promise<void>;
}

export default function DesignSystemForm({ onCreate }: DesignSystemFormProps) {
  const [name, setName] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#000000");
  const [secondaryColor, setSecondaryColor] = useState("#ffffff");
  const [backgroundColor, setBackgroundColor] = useState("#f0f0f0");
  const [primaryFont, setPrimaryFont] = useState("");
  const [secondaryFont, setSecondaryFont] = useState("");
  const [editorBackground, setEditorBackground] = useState("#ffffff");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onCreate({
        name,
        primaryColor,
        secondaryColor,
        backgroundColor,
        editorBackground,
        primaryFont,
        secondaryFont,
        profileId: "default-profile-id", // Replace with actual profile ID
      });
      console.log("Design system created successfully");
      // Reset form
      setName("");
      setPrimaryColor("#000000");
      setSecondaryColor("#ffffff");
      setBackgroundColor("#f0f0f0");
      setPrimaryFont("");
      setSecondaryFont("");
    } catch (error) {
      console.error("Error creating design system:", error);
    }
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
        } else {
          throw new Error("Failed to upload font");
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
          type="color"
          value={backgroundColor}
          onChange={(e) => setBackgroundColor(e.target.value)}
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
