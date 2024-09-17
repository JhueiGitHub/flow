// /app/flow/components/ActiveDesignSystem.tsx

import React, { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { DesignSystem } from "@prisma/client";
import ColorPicker from "./ColorPicker";
import { FileUpload } from "./file-upload";
import debounce from "lodash/debounce";

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

  const handleChange = useCallback(
    debounce((key: keyof DesignSystem, value: string) => {
      setEditedSystem((prev) => {
        const updated = { ...prev, [key]: value };
        onUpdate(updated);
        return updated;
      });
    }, 300),
    [onUpdate]
  );

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

  useEffect(() => {
    // Load custom fonts
    const loadFont = async (url: string, fontFamily: string) => {
      if (url) {
        try {
          const font = new FontFace(fontFamily, `url(${url})`);
          await font.load();
          document.fonts.add(font);
        } catch (error) {
          console.error(`Error loading font ${fontFamily}:`, error);
        }
      }
    };

    loadFont(editedSystem.primaryFontUrl || "", "CustomPrimaryFont");
    loadFont(editedSystem.secondaryFontUrl || "", "CustomSecondaryFont");
  }, [editedSystem.primaryFontUrl, editedSystem.secondaryFontUrl]);

  return (
    <motion.div
      className="bg-gray-800 p-6 rounded-lg shadow"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <h3 className="text-xl font-semibold mb-4 text-white">
        {editedSystem.name}
      </h3>

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
                <label className="text-sm font-medium text-gray-300 mb-1">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </label>
                <ColorPicker
                  color={value}
                  onChange={(color) => {
                    handleChange(key as keyof DesignSystem, color);
                  }}
                  label={key}
                />
              </div>
            );
          }
          return null;
        })}
      </div>

      <div className="space-y-4 mb-6">
        {["primaryFont", "secondaryFont"].map((fontType) => (
          <div key={fontType} className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-300 w-32">
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
            <span className="text-sm text-gray-400">
              {editedSystem[fontType as "primaryFont" | "secondaryFont"]}
            </span>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-2 text-white">Preview</h4>
        <div
          className="p-4 rounded"
          style={{ backgroundColor: editedSystem.backgroundColor }}
        >
          <h5
            style={{
              color: editedSystem.primaryColor,
              fontFamily: `'CustomPrimaryFont', ${editedSystem.primaryFont}, sans-serif`,
            }}
            className="text-xl mb-2"
          >
            Primary Heading
          </h5>
          <p
            style={{
              color: editedSystem.textPrimary,
              fontFamily: `'CustomSecondaryFont', ${editedSystem.secondaryFont}, sans-serif`,
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

      {isUploading && <p className="text-blue-500 mt-2">Uploading font...</p>}
      {uploadError && <p className="text-red-500 mt-2">{uploadError}</p>}
    </motion.div>
  );
};

export default ActiveDesignSystem;
