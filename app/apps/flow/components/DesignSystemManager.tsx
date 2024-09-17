// /app/flow/components/DesignSystemManager.tsx

import React, { useState, useEffect, useCallback } from "react";
import { DesignSystem } from "@prisma/client";
import DesignSystemList from "./DesignSystemList";
import DesignSystemForm from "./DesignSystemForm";
import ActiveDesignSystem from "./ActiveDesignSystem";
import { useDesignSystem } from "@/contexts/DesignSystemContext";

export default function DesignSystemManager() {
  const [designSystems, setDesignSystems] = useState<DesignSystem[]>([]);
  const { activeDesignSystem, setActiveDesignSystem } = useDesignSystem();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Preserved: Fetching design systems
  const fetchDesignSystems = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/design-systems");
      if (!response.ok) {
        throw new Error("Failed to fetch design systems");
      }
      const data = await response.json();
      setDesignSystems(data);
    } catch (error) {
      console.error("Error fetching design systems:", error);
      setError("Failed to load design systems. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDesignSystems();
  }, [fetchDesignSystems]);

  // Preserved: Creating a new design system
  const handleCreateDesignSystem = async (newSystem: Partial<DesignSystem>) => {
    try {
      const response = await fetch("/api/design-systems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSystem),
      });
      if (!response.ok) {
        throw new Error("Failed to create design system");
      }
      await fetchDesignSystems();
      setShowCreateForm(false);
    } catch (error) {
      console.error("Error creating design system:", error);
      setError("Failed to create design system. Please try again.");
    }
  };

  // Updated: Activating a design system
  // Changed the URL to use the new /activate endpoint
  const handleActivateDesignSystem = useCallback(
    async (system: DesignSystem) => {
      try {
        const response = await fetch(
          `/api/design-systems/${system.id}/activate`,
          {
            method: "POST",
          }
        );
        if (!response.ok) {
          throw new Error("Failed to activate design system");
        }
        setActiveDesignSystem(system);
        await fetchDesignSystems();
      } catch (error) {
        console.error("Error activating design system:", error);
        setError("Failed to activate design system. Please try again.");
      }
    },
    [setActiveDesignSystem, fetchDesignSystems]
  );

  // Preserved: Exporting a design system
  const handleExportDesignSystem = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/design-systems/${id}/export`);
      if (!response.ok) {
        throw new Error("Failed to export design system");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `design-system-${id}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting design system:", error);
      setError("Failed to export design system. Please try again.");
    }
  }, []);

  // Preserved: Deleting a design system
  const handleDeleteDesignSystem = useCallback(
    async (id: string) => {
      try {
        const response = await fetch(`/api/design-systems/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error("Failed to delete design system");
        }
        await fetchDesignSystems();
        if (activeDesignSystem?.id === id) {
          setActiveDesignSystem(null);
        }
      } catch (error) {
        console.error("Error deleting design system:", error);
        setError("Failed to delete design system. Please try again.");
      }
    },
    [activeDesignSystem, fetchDesignSystems, setActiveDesignSystem]
  );

  // Preserved: Updating a design system
  const handleUpdateDesignSystem = async (updatedSystem: DesignSystem) => {
    try {
      const response = await fetch(`/api/design-systems/${updatedSystem.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedSystem),
      });
      if (!response.ok) {
        throw new Error("Failed to update design system");
      }
      setActiveDesignSystem(updatedSystem);
      await fetchDesignSystems();
    } catch (error) {
      console.error("Error updating design system:", error);
      setError("Failed to update design system. Please try again.");
    }
  };

  if (isLoading) {
    return <div>Loading design systems...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Your Design Systems</h2>
        <DesignSystemList
          systems={designSystems}
          onDelete={handleDeleteDesignSystem}
          onActivate={handleActivateDesignSystem}
          onExport={handleExportDesignSystem}
          activeSystemId={activeDesignSystem?.id}
        />
        <button
          onClick={() => setShowCreateForm(true)}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create New Design System
        </button>
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-4">
          {showCreateForm ? "Create New Design System" : "Active Design System"}
        </h2>
        {showCreateForm ? (
          <DesignSystemForm
            onSubmit={handleCreateDesignSystem}
            onCancel={() => setShowCreateForm(false)}
          />
        ) : activeDesignSystem ? (
          <ActiveDesignSystem
            system={activeDesignSystem}
            onUpdate={handleUpdateDesignSystem}
          />
        ) : (
          <p>
            No active design system. Select one from the list or create a new
            one.
          </p>
        )}
      </div>
      {error && (
        <div
          className="col-span-2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
          role="alert"
        >
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
