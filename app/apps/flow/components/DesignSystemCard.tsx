// app/flow/components/DesignSystemCard.tsx

import React from "react";
import { DesignSystem } from "@/types/DesignSystem";

interface DesignSystemCardProps {
  system: DesignSystem;
  onActivate: () => void;
  onExport: () => void;
}

const DesignSystemCard: React.FC<DesignSystemCardProps> = ({
  system,
  onActivate,
  onExport,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold mb-2">{system.name}</h3>
      <div className="flex flex-wrap gap-2 mb-2">
        <div
          className="w-6 h-6 rounded-full"
          style={{ backgroundColor: system.primaryColor }}
          title="Primary Color"
        />
        <div
          className="w-6 h-6 rounded-full"
          style={{ backgroundColor: system.secondaryColor }}
          title="Secondary Color"
        />
        <div
          className="w-6 h-6 rounded-full"
          style={{ backgroundColor: system.backgroundColor }}
          title="Background Color"
        />
        <div
          className="w-6 h-6 rounded-full"
          style={{ backgroundColor: system.accentColor }}
          title="Accent Color"
        />
        <div
          className="w-6 h-6 rounded-full"
          style={{ backgroundColor: system.textPrimary }}
          title="Text Primary"
        />
        <div
          className="w-6 h-6 rounded-full"
          style={{ backgroundColor: system.textAccentColor }}
          title="Text Accent Color"
        />
      </div>
      <div className="flex justify-between">
        <button
          onClick={onActivate}
          className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
        >
          Activate
        </button>
        <button
          onClick={onExport}
          className="bg-gray-200 text-gray-800 px-3 py-1 rounded text-sm hover:bg-gray-300"
        >
          Export
        </button>
      </div>
    </div>
  );
};

export default DesignSystemCard;
