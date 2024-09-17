// /app/flow/components/FontUploader.tsx

import React, { useState, useCallback, useEffect } from "react";
import { useDesignSystem } from "@/contexts/DesignSystemContext";
import { FontManager } from "@/lib/FontManager";
import { FontFile } from "@prisma/client";
import { FileUpload } from "./file-upload";

export const FontUploader: React.FC = () => {
  const { activeDesignSystem, setActiveDesignSystem } = useDesignSystem();
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFonts, setUploadedFonts] = useState<FontFile[]>([]);
  const [fontType, setFontType] = useState<"primaryFont" | "secondaryFont">(
    "primaryFont"
  );

  useEffect(() => {
    if (activeDesignSystem) {
      fetchUploadedFonts();
    }
  }, [activeDesignSystem]);

  const fetchUploadedFonts = async () => {
    if (activeDesignSystem) {
      const fonts = await FontManager.getFontsForProfile(
        activeDesignSystem.profileId
      );
      setUploadedFonts(fonts);
    }
  };

  const handleFontUpload = useCallback(
    async (files: File[]) => {
      if (files.length === 0 || !activeDesignSystem) {
        setUploadError("No file was uploaded or no active design system.");
        return;
      }

      setIsUploading(true);
      setUploadError(null);

      try {
        const uploadedFont = await FontManager.uploadFont(
          files[0],
          activeDesignSystem.profileId
        );

        if (uploadedFont) {
          const updatedSystem = {
            ...activeDesignSystem,
            [fontType]: uploadedFont.fileName,
            [`${fontType}Url`]: uploadedFont.fileUrl,
          };

          const response = await fetch(
            `/api/design-systems/${activeDesignSystem.id}`,
            {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(updatedSystem),
            }
          );

          if (!response.ok) {
            throw new Error("Failed to update design system");
          }

          const updatedDesignSystem = await response.json();
          setActiveDesignSystem(updatedDesignSystem);
          await fetchUploadedFonts();
        } else {
          throw new Error("Failed to upload font");
        }
      } catch (error) {
        console.error("Error uploading font:", error);
        setUploadError("Failed to upload font. Please try again.");
      } finally {
        setIsUploading(false);
      }
    },
    [activeDesignSystem, fontType, setActiveDesignSystem]
  );

  const handleDeleteFont = useCallback(
    async (fontId: string) => {
      if (!activeDesignSystem) return;

      try {
        const success = await FontManager.deleteFontFile(fontId);
        if (success) {
          await fetchUploadedFonts();

          // Remove the font from the design system if it's currently in use
          const updatedSystem = { ...activeDesignSystem };
          if (updatedSystem.primaryFont === fontId) {
            updatedSystem.primaryFont = "";
            updatedSystem.primaryFontUrl = "";
          }
          if (updatedSystem.secondaryFont === fontId) {
            updatedSystem.secondaryFont = "";
            updatedSystem.secondaryFontUrl = "";
          }

          const response = await fetch(
            `/api/design-systems/${activeDesignSystem.id}`,
            {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(updatedSystem),
            }
          );

          if (!response.ok) {
            throw new Error("Failed to update design system");
          }

          const updatedDesignSystem = await response.json();
          setActiveDesignSystem(updatedDesignSystem);
        } else {
          setUploadError("Failed to delete font. Please try again.");
        }
      } catch (error) {
        console.error("Error deleting font:", error);
        setUploadError("Failed to delete font. Please try again.");
      }
    },
    [activeDesignSystem, setActiveDesignSystem]
  );

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">Upload Font</h3>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Font Type
        </label>
        <select
          value={fontType}
          onChange={(e) =>
            setFontType(e.target.value as "primaryFont" | "secondaryFont")
          }
          className="block w-full px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
        >
          <option value="primaryFont">Primary Font</option>
          <option value="secondaryFont">Secondary Font</option>
        </select>
      </div>
      <FileUpload onChange={handleFontUpload} accept=".ttf,.otf,.woff,.woff2" />
      {isUploading && <p className="text-blue-500 mt-2">Uploading font...</p>}
      {uploadError && <p className="text-red-500 mt-2">{uploadError}</p>}
      {activeDesignSystem && (
        <div className="mt-4">
          <h4 className="text-md font-semibold mb-2">Current Fonts</h4>
          <p>Primary Font: {activeDesignSystem.primaryFont || "None"}</p>
          <p>Secondary Font: {activeDesignSystem.secondaryFont || "None"}</p>
        </div>
      )}
      {uploadedFonts.length > 0 && (
        <div className="mt-4">
          <h4 className="text-md font-semibold mb-2">Uploaded Fonts</h4>
          <ul>
            {uploadedFonts.map((font) => (
              <li
                key={font.id}
                className="flex justify-between items-center mb-2"
              >
                <span>{font.name}</span>
                <button
                  onClick={() => handleDeleteFont(font.id)}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
