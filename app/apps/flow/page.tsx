// /root/app/apps/flow/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import DesignSystemForm from "./components/DesignSystemForm";
import DesignSystemList from "./components/DesignSystemList";
import { DesignSystem } from "@prisma/client";

export default function FlowPage() {
  const [designSystems, setDesignSystems] = useState<DesignSystem[]>([]);

  useEffect(() => {
    fetchDesignSystems();
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

  const handleCreate = async (
    newSystem: Omit<
      DesignSystem,
      "id" | "createdAt" | "updatedAt" | "profileId"
    >
  ) => {
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

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/design-systems/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        await fetchDesignSystems();
      }
    } catch (error) {
      console.error("Error deleting design system:", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Flow Design System</h1>
      <DesignSystemForm onCreate={handleCreate} />
      <DesignSystemList systems={designSystems} onDelete={handleDelete} />
    </div>
  );
}
