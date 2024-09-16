// app/flow/components/DesignSystemForm.tsx

import React, { useState } from "react";
import { DesignSystem } from "@/types/DesignSystem";
import ColorPicker from "./ColorPicker";

interface DesignSystemFormProps {
  onSubmit: (newSystem: Partial<DesignSystem>) => Promise<void>;
  onCancel: () => void;
}

export default function DesignSystemForm({
  onSubmit,
  onCancel,
}: DesignSystemFormProps) {
  const [formData, setFormData] = useState<Partial<DesignSystem>>({
    name: "",
    primaryColor: "#000000",
    secondaryColor: "#FFFFFF",
    backgroundColor: "#F0F0F0",
    overlayBackground: "#00000080",
    overlayBorder: "#FFFFFF40",
    textPrimary: "#000000",
    accentColor: "#0000FF",
    textAccentColor: "#FF0000",
    primaryFont: "Arial",
    secondaryFont: "Helvetica",
    editorBackground: "#FFFFFF",
  });

  const handleChange = (key: keyof DesignSystem, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-6 rounded-lg shadow"
    >
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Design System Name
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          required
        />
      </div>

      {Object.entries(formData).map(([key, value]) => {
        if (
          typeof value === "string" &&
          key !== "name" &&
          key !== "primaryFont" &&
          key !== "secondaryFont"
        ) {
          return (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </label>
              <ColorPicker
                color={value}
                onChange={(color) =>
                  handleChange(key as keyof DesignSystem, color)
                }
                label={key}
              />
            </div>
          );
        }
        return null;
      })}

      <div>
        <label
          htmlFor="primaryFont"
          className="block text-sm font-medium text-gray-700"
        >
          Primary Font
        </label>
        <input
          type="text"
          id="primaryFont"
          value={formData.primaryFont}
          onChange={(e) => handleChange("primaryFont", e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          required
        />
      </div>

      <div>
        <label
          htmlFor="secondaryFont"
          className="block text-sm font-medium text-gray-700"
        >
          Secondary Font
        </label>
        <input
          type="text"
          id="secondaryFont"
          value={formData.secondaryFont}
          onChange={(e) => handleChange("secondaryFont", e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          required
        />
      </div>

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          Create Design System
        </button>
      </div>
    </form>
  );
}
