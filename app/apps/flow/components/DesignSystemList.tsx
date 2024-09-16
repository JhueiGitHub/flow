// app/flow/components/DesignSystemList.tsx

/*
Functionality:
- Displays a list of all design systems
- Provides options to edit, delete, and activate design systems
- Shows which design system is currently active
- Handles user interactions for managing design systems
*/

import React from "react";
import { DesignSystem } from "@prisma/client";

interface DesignSystemListProps {
  systems: DesignSystem[];
  onDelete: (id: string) => Promise<void>;
  onActivate: (system: DesignSystem) => Promise<void>;
  activeSystemId: string | undefined;
}

const DesignSystemList: React.FC<DesignSystemListProps> = ({
  systems,
  onDelete,
  onActivate,
  activeSystemId,
}) => {
  return (
    <ul className="space-y-2">
      {systems.map((system) => (
        <li
          key={system.id}
          className="flex items-center justify-between p-2 border rounded"
        >
          <span>
            {system.name} {system.id === activeSystemId && " (Active)"}
          </span>
          <div>
            <button
              onClick={() => onActivate(system)}
              className="px-2 py-1 mr-2 text-white bg-blue-500 rounded"
              disabled={system.id === activeSystemId}
            >
              {system.id === activeSystemId ? "Active" : "Activate"}
            </button>
            <button
              onClick={() => onDelete(system.id)}
              className="px-2 py-1 text-white bg-red-500 rounded"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default DesignSystemList;
