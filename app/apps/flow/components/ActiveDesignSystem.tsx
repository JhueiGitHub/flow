// app/flow/components/ActiveDesignSystem.tsx

import React, { useState } from "react";
import { DesignSystem } from "@/types/DesignSystem";
import ColorPicker from "./ColorPicker";

interface ActiveDesignSystemProps {
  system: DesignSystem;
}

const ActiveDesignSystem: React.FC<ActiveDesignSystemProps> = ({ system }) => {
  const [editedSystem, setEditedSystem] = useState(system);

  const handleUpdate = async () => {
    try {
      const response = await fetch(`/api/design-systems/${system.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedSystem),
      });
      if (response.ok) {
        // TODO: Update the active design system in the context
        console.log("Design system updated successfully");
      }
    } catch (error) {
      console.error("Error updating design system:", error);
    }
  };

  const handleChange = (key: keyof DesignSystem, value: string) => {
    setEditedSystem((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow space-y-4">
      <h3 className="text-xl font-semibold">{editedSystem.name}</h3>

      {Object.entries(editedSystem).map(([key, value]) => {
        if (
          typeof value === "string" &&
          key !== "id" &&
          key !== "name" &&
          key !== "profileId"
        ) {
          if (
            key.toLowerCase().includes("color") ||
            key.toLowerCase().includes("background")
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
          } else if (key.toLowerCase().includes("font")) {
            return (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </label>
                <input
                  type="text"
                  value={value}
                  onChange={(e) =>
                    handleChange(key as keyof DesignSystem, e.target.value)
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
            );
          }
        }
        return null;
      })}

      {/* Preview section */}
      <div className="mt-8">
        <h4 className="text-lg font-semibold mb-2">Preview</h4>
        <div
          className="p-4 rounded"
          style={{ backgroundColor: editedSystem.backgroundColor }}
        >
          <h5
            style={{
              color: editedSystem.primaryColor,
              fontFamily: editedSystem.primaryFont,
            }}
            className="text-xl mb-2"
          >
            Primary Heading
          </h5>
          <p
            style={{
              color: editedSystem.textPrimary,
              fontFamily: editedSystem.secondaryFont,
            }}
          >
            This is a sample text in the primary text color and secondary font.
          </p>
          <div
            style={{
              backgroundColor: editedSystem.overlayBackground,
              border: `1px solid ${editedSystem.overlayBorder}`,
              padding: "8px",
              marginTop: "8px",
              borderRadius: "4px",
            }}
          >
            <p style={{ color: editedSystem.textAccentColor }}>
              This is an example of overlay with accent text.
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={handleUpdate}
        className="mt-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
      >
        Update Design System
      </button>
    </div>
  );
};

export default ActiveDesignSystem;
