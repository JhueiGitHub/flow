// DesignSystemDropdown.tsx

import React, { useState, useEffect } from "react";
import { useDesignSystem } from "@/contexts/DesignSystemContext";
import { DesignSystem } from "@/types/DesignSystem";

const DesignSystemDropdown: React.FC = () => {
  const { activeDesignSystem, setActiveDesignSystem } = useDesignSystem();
  const [designSystems, setDesignSystems] = useState<DesignSystem[]>([]);

  useEffect(() => {
    const fetchDesignSystems = async () => {
      try {
        const response = await fetch("/api/design-systems");
        if (response.ok) {
          const data = await response.json();
          setDesignSystems(data);
        }
      } catch (error) {
        console.error("Error fetching design systems:", error);
      }
    };
    fetchDesignSystems();
  }, []);

  const handleDesignSystemChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedId = e.target.value;
    const selectedSystem = designSystems.find((ds) => ds.id === selectedId);
    if (selectedSystem) {
      try {
        const response = await fetch(
          `/api/design-systems/${selectedId}/activate`,
          {
            method: "POST",
          }
        );
        if (response.ok) {
          setActiveDesignSystem(selectedSystem);
        }
      } catch (error) {
        console.error("Error activating design system:", error);
      }
    }
  };

  return (
    <select
      value={activeDesignSystem?.id || ""}
      onChange={handleDesignSystemChange}
      style={{
        backgroundColor: activeDesignSystem?.overlayBackground,
        color: activeDesignSystem?.textPrimary,
        border: `1px solid ${activeDesignSystem?.overlayBorder}`,
        padding: "5px",
        borderRadius: "4px",
      }}
    >
      {designSystems.map((system) => (
        <option key={system.id} value={system.id}>
          {system.name}
        </option>
      ))}
    </select>
  );
};

export default DesignSystemDropdown;
