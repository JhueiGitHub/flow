import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DesignSystem } from "@prisma/client";

interface DesignSystemDropdownProps {
  systems: DesignSystem[];
  activeSystemId: string | undefined;
  onActivate: (system: DesignSystem) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onExport: (id: string) => Promise<void>;
}

const DesignSystemDropdown: React.FC<DesignSystemDropdownProps> = ({
  systems,
  activeSystemId,
  onActivate,
  onDelete,
  onExport,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const activeSystem = systems.find((system) => system.id === activeSystemId);

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-gray-700 text-white px-4 py-2 rounded flex justify-between items-center"
      >
        <span>
          {activeSystem ? activeSystem.name : "Select a Design System"}
        </span>
        <svg
          className={`w-5 h-5 transition-transform ${
            isOpen ? "transform rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-10 w-full mt-1 bg-gray-800 rounded shadow-lg"
          >
            {systems.map((system) => (
              <motion.li
                key={system.id}
                whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                className="p-2 cursor-pointer"
              >
                <div className="flex justify-between items-center">
                  <span
                    className="text-white cursor-pointer"
                    onClick={() => {
                      onActivate(system);
                      setIsOpen(false);
                    }}
                  >
                    {system.name}
                  </span>
                  <div>
                    <button
                      onClick={() => onExport(system.id)}
                      className="text-blue-400 hover:text-blue-300 mr-2"
                    >
                      Export
                    </button>
                    <button
                      onClick={() => onDelete(system.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DesignSystemDropdown;
