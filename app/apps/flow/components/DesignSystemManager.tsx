// /app/flow/components/DesignSystemManager.tsx

import React, { useState, useEffect, useCallback } from "react";
import { DesignSystem } from "@prisma/client";
import { useDesignSystem } from "@/contexts/DesignSystemContext";
import FlowAppLayout from "./FlowAppLayout";

export default function DesignSystemManager() {
  const [designSystems, setDesignSystems] = useState<DesignSystem[]>([]);
  const { activeDesignSystem, setActiveDesignSystem } = useDesignSystem();
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
    <FlowAppLayout
      designSystems={designSystems}
      activeDesignSystem={activeDesignSystem}
      onCreateDesignSystem={handleCreateDesignSystem}
      onUpdateDesignSystem={handleUpdateDesignSystem}
      onActivateDesignSystem={handleActivateDesignSystem}
      onDeleteDesignSystem={handleDeleteDesignSystem}
      onExportDesignSystem={handleExportDesignSystem}
    />
  );
}
