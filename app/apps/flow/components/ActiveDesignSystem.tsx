// /app/flow/components/ActiveDesignSystem.tsx

import React, { useState, useCallback } from "react";
import { DesignSystem } from "@prisma/client";
import ColorPicker from "./ColorPicker";
import { FileUpload } from "./file-upload"; // Aceternity component
import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

interface ActiveDesignSystemProps {
  system: DesignSystem;
  onUpdate: (updatedSystem: DesignSystem) => Promise<void>;
}

const ActiveDesignSystem: React.FC<ActiveDesignSystemProps> = ({
  system,
  onUpdate,
}) => {
  const [editedSystem, setEditedSystem] = useState(system);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = useCallback((key: keyof DesignSystem, value: string) => {
    setEditedSystem((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleUpdate = async () => {
    try {
      await onUpdate(editedSystem);
    } catch (error) {
      console.error("Error updating design system:", error);
      setUploadError("Failed to update design system. Please try again.");
    }
  };

  const handleFontUpload = useCallback(
    async (fontType: "primaryFont" | "secondaryFont", files: File[]) => {
      if (files.length === 0) {
        setUploadError("No file was uploaded.");
        return;
      }

      setIsUploading(true);
      setUploadError(null);

      try {
        const formData = new FormData();
        formData.append("file", files[0]);
        formData.append("fontType", fontType);

        const response = await fetch("/api/upload-font", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to upload font");
        }

        const { fileUrl, fileName } = await response.json();

        const updatedSystem = {
          ...editedSystem,
          [fontType]: fileName,
          [`${fontType}Url`]: fileUrl,
        };

        setEditedSystem(updatedSystem);
        await onUpdate(updatedSystem);
      } catch (error) {
        console.error("Error uploading font:", error);
        setUploadError("Failed to upload font. Please try again.");
      } finally {
        setIsUploading(false);
      }
    },
    [editedSystem, onUpdate]
  );

  return (
    <div className="">
      <h3 className="text-xl font-semibold mb-4">{editedSystem.name}</h3>

      {/* Color pickers displayed horizontally */}
      <div className="flex flex-wrap gap-4 mb-6">
        {Object.entries(editedSystem).map(([key, value]) => {
          if (
            typeof value === "string" &&
            key !== "id" &&
            key !== "name" &&
            key !== "profileId" &&
            !key.toLowerCase().includes("font") &&
            !key.toLowerCase().includes("url")
          ) {
            return (
              <div key={key} className="flex flex-col items-center">
                <label className="text-sm font-medium text-gray-700 mb-1">
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
      </div>

      {/* Font upload section with Aceternity FileUpload */}
      <div className="space-y-4 mb-6">
        {["primaryFont", "secondaryFont"].map((fontType) => (
          <div key={fontType} className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700 w-32">
              {fontType.charAt(0).toUpperCase() + fontType.slice(1)}
            </label>
            <FileUpload
              onChange={(files) =>
                handleFontUpload(
                  fontType as "primaryFont" | "secondaryFont",
                  files
                )
              }
            />
            <span className="text-sm text-gray-600">
              {editedSystem[fontType as "primaryFont" | "secondaryFont"]}
            </span>
          </div>
        ))}
      </div>

      {/* Preview section remains unchanged */}
      <div className="mb-6">
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
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Update Design System
      </button>

      {isUploading && <p className="text-blue-500 mt-2">Uploading font...</p>}
      {uploadError && <p className="text-red-500 mt-2">{uploadError}</p>}
    </div>
  );
};

export default ActiveDesignSystem;
