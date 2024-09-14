// /root/app/flow/components/DesignSystemList.tsx

import React from "react";
import { DesignSystem } from "@prisma/client";

interface DesignSystemListProps {
  systems: DesignSystem[];
  onDelete: (id: string) => Promise<void>;
}

export default function DesignSystemList({
  systems,
  onDelete,
}: DesignSystemListProps) {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Existing Design Systems</h2>
      <ul className="space-y-2">
        {systems.map((system) => (
          <li
            key={system.id}
            className="p-2 border rounded flex justify-between items-center"
          >
            <span>
              {system.name} - Primary:{" "}
              <span style={{ color: system.primaryColor }}>
                {system.primaryColor}
              </span>
              , Secondary:{" "}
              <span style={{ color: system.secondaryColor }}>
                {system.secondaryColor}
              </span>
              , Background:{" "}
              <span
                style={{
                  backgroundColor: system.backgroundColor,
                  padding: "0 5px",
                }}
              >
                {system.backgroundColor}
              </span>
            </span>
            <button
              onClick={() => onDelete(system.id)}
              className="px-2 py-1 bg-red-500 text-white rounded"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
