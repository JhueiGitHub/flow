"use client";

import React, { useState, useEffect } from "react";
import { DesignSystem } from "@prisma/client";
import ColorPicker from "./components/ColorPicker";
import DesignSystemForm from "./components/DesignSystemForm";
import DesignSystemList from "./components/DesignSystemList";

export default function FlowPage() {
  const [designSystems, setDesignSystems] = useState<DesignSystem[]>([]);
  const [activeDesignSystem, setActiveDesignSystem] =
    useState<DesignSystem | null>(null);

  useEffect(() => {
    fetchDesignSystems();
    fetchActiveDesignSystem();
  }, []);

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

  const fetchActiveDesignSystem = async () => {
    try {
      const response = await fetch("/api/active-design-system");
      if (response.ok) {
        const data = await response.json();
        setActiveDesignSystem(data);
      }
    } catch (error) {
      console.error("Error fetching active design system:", error);
    }
  };

  const handleColorChange = async (key: keyof DesignSystem, value: string) => {
    if (!activeDesignSystem) return;

    try {
      const response = await fetch(
        `/api/design-systems/${activeDesignSystem.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ [key]: value }),
        }
      );

      if (response.ok) {
        const updatedDesignSystem = await response.json();
        setActiveDesignSystem(updatedDesignSystem);
        setDesignSystems((prevSystems) =>
          prevSystems.map((system) =>
            system.id === updatedDesignSystem.id ? updatedDesignSystem : system
          )
        );
      }
    } catch (error) {
      console.error("Error updating design system:", error);
    }
  };

  const handleCreateDesignSystem = async (newSystem: Partial<DesignSystem>) => {
    try {
      const response = await fetch("/api/design-systems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSystem),
      });
      if (response.ok) {
        await fetchDesignSystems();
      }
    } catch (error) {
      console.error("Error creating design system:", error);
    }
  };

  const handleDeleteDesignSystem = async (id: string) => {
    try {
      const response = await fetch(`/api/design-systems/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        await fetchDesignSystems();
        if (activeDesignSystem?.id === id) {
          await fetchActiveDesignSystem();
        }
      }
    } catch (error) {
      console.error("Error deleting design system:", error);
    }
  };

  const handleActivateDesignSystem = async (system: DesignSystem) => {
    try {
      const response = await fetch("/api/active-design-system", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ designSystemId: system.id }),
      });
      if (response.ok) {
        setActiveDesignSystem(system);
      }
    } catch (error) {
      console.error("Error activating design system:", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Flow Design System</h1>

      <h2 className="text-xl font-semibold mt-6 mb-2">Active Design System</h2>
      {activeDesignSystem && (
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">
            {activeDesignSystem.name}
          </h3>
          <div className="flex flex-wrap gap-4">
            {Object.entries(activeDesignSystem).map(([key, value]) => {
              if (typeof value === "string" && value.startsWith("#")) {
                return (
                  <ColorPicker
                    key={key}
                    color={value}
                    onChange={(newColor) =>
                      handleColorChange(key as keyof DesignSystem, newColor)
                    }
                    label={key}
                  />
                );
              }
              return null;
            })}
          </div>
        </div>
      )}

      <h2 className="text-xl font-semibold mt-6 mb-2">
        Create New Design System
      </h2>
      <DesignSystemForm onSubmit={handleCreateDesignSystem} />

      <h2 className="text-xl font-semibold mt-6 mb-2">All Design Systems</h2>
      <DesignSystemList
        systems={designSystems}
        onDelete={handleDeleteDesignSystem}
        onActivate={handleActivateDesignSystem}
        activeSystemId={activeDesignSystem?.id}
      />
    </div>
  );
}
