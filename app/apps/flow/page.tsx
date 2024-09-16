// /app/flow/page.tsx

"use client";

import React, { useState, useEffect, useCallback } from "react";
import { DesignSystem } from "@prisma/client";
import DesignSystemCard from "./components/DesignSystemCard";
import DesignSystemForm from "./components/DesignSystemForm";
import ActiveDesignSystem from "./components/ActiveDesignSystem";
import { FontUploader } from "./components/FontUploader";
import { useDesignSystem } from "@/contexts/DesignSystemContext";

export default function FlowPage() {
  const [designSystems, setDesignSystems] = useState<DesignSystem[]>([]);
  const { activeDesignSystem, setActiveDesignSystem } = useDesignSystem();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (isLoading) {
    return <div>Loading design systems...</div>;
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-8">Flow Design System</h1>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
          role="alert"
        >
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Your Design Systems</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {designSystems.map((system) => (
              <DesignSystemCard
                key={system.id}
                system={system}
                onActivate={() => handleActivateDesignSystem(system)}
                onExport={() => handleExportDesignSystem(system.id)}
              />
            ))}
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Create New Design System
          </button>
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
            <>
              <ActiveDesignSystem system={activeDesignSystem} />
              <FontUploader />
            </>
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
