// app/flow/page.tsx

/*
Core elements being considered:
1. Overall layout and styling
2. Design system list with card-based design
3. Create new design system form
4. Export and import functionality (UI elements only at this stage)
5. Active design system display and edit functionality
6. Color picker integration
*/

"use client";

import React, { useState, useEffect } from "react";
import { DesignSystem } from "@prisma/client";
import DesignSystemCard from "./components/DesignSystemCard";
import DesignSystemForm from "./components/DesignSystemForm";
import ActiveDesignSystem from "./components/ActiveDesignSystem";
import { useDesignSystem } from "@/contexts/DesignSystemContext";

export default function FlowPage() {
  const [designSystems, setDesignSystems] = useState<DesignSystem[]>([]);
  const { activeDesignSystem, setActiveDesignSystem } = useDesignSystem();
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    fetchDesignSystems();
  }, []);

  // Preserved functionality: Fetching design systems
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

  // Preserved functionality: Creating a new design system
  const handleCreateDesignSystem = async (newSystem: Partial<DesignSystem>) => {
    try {
      const response = await fetch("/api/design-systems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSystem),
      });
      if (response.ok) {
        await fetchDesignSystems();
        setShowCreateForm(false);
      }
    } catch (error) {
      console.error("Error creating design system:", error);
    }
  };

  // New functionality: Handling design system export
  const handleExport = async (id: string) => {
    // TODO: Implement export functionality
    console.log("Exporting design system:", id);
  };

  // New functionality: Handling design system import
  const handleImport = async (file: File) => {
    // TODO: Implement import functionality
    console.log("Importing design system:", file.name);
  };

  return (
    <div className="p-8 bg-black bg-opacity-60 min-h-screen">
      <h1 className="text-4xl font-bold mb-8">Flow Design System</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Your Design Systems</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {designSystems.map((system) => (
              <DesignSystemCard
                key={system.id}
                system={system}
                onActivate={() => setActiveDesignSystem(system)}
                onExport={() => handleExport(system.id)}
              />
            ))}
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Create New Design System
          </button>
          {/* New UI element for import functionality */}
          <input
            type="file"
            accept=".flow"
            onChange={(e) => e.target.files && handleImport(e.target.files[0])}
            className="mt-4"
          />
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">
            {showCreateForm
              ? "Create New Design System"
              : "Active Design System"}
          </h2>
          {showCreateForm ? (
            <DesignSystemForm
              onSubmit={handleCreateDesignSystem}
              onCancel={() => setShowCreateForm(false)}
            />
          ) : activeDesignSystem ? (
            <ActiveDesignSystem system={activeDesignSystem} />
          ) : (
            <p>
              No active design system. Select one from the list or create a new
              one.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
