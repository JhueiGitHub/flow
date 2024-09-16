// /app/flow/components/FontUploader.tsx

import React, { useState, useCallback } from "react";
import { useDesignSystem } from "@/contexts/DesignSystemContext";
import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { FileUpload } from "./file-upload"; // Aceternity component

export const FontUploader: React.FC = () => {
  const { activeDesignSystem, setActiveDesignSystem } = useDesignSystem();
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFontUpload = useCallback(
    async (res: any[]) => {
      setUploadError(null);
      setIsUploading(false);

      if (res.length === 0 || !activeDesignSystem) {
        setUploadError("No file was uploaded or no active design system.");
        return;
      }

      const { fileUrl, fileKey } = res[0] as {
        fileUrl: string;
        fileKey: string;
      };

      try {
        const updatedDesignSystem = {
          ...activeDesignSystem,
          primaryFont: fileKey,
          primaryFontUrl: fileUrl,
        };

        const response = await fetch(
          `/api/design-systems/${activeDesignSystem.id}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedDesignSystem),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update design system");
        }

        const updatedSystem = await response.json();
        setActiveDesignSystem(updatedSystem);
      } catch (error) {
        console.error("Error updating design system:", error);
        setUploadError("Failed to update design system. Please try again.");
      }
    },
    [activeDesignSystem, setActiveDesignSystem]
  );

  const startUpload = useCallback(() => {
    setIsUploading(true);
    setUploadError(null);
  }, []);

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">Upload Font</h3>
      <FileUpload
        onChange={(files: File[]) => {
          console.log("Files selected:", files);
        }}
      />
      <UploadButton<OurFileRouter, "fontUploader">
        endpoint="fontUploader"
        onClientUploadComplete={handleFontUpload}
        onUploadBegin={startUpload}
        onUploadError={(error: Error) => {
          setUploadError(error.message);
          setIsUploading(false);
        }}
      />
      {isUploading && <p className="text-blue-500 mt-2">Uploading font...</p>}
      {uploadError && <p className="text-red-500 mt-2">{uploadError}</p>}
      {activeDesignSystem?.primaryFontUrl && (
        <p className="text-green-500 mt-2">
          Current font: {activeDesignSystem.primaryFont}
        </p>
      )}
    </div>
  );
};
