// /app/flow/page.tsx

"use client";

import React from "react";
import DesignSystemManager from "./components/DesignSystemManager";

export default function FlowPage() {
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-8">Flow Design System</h1>
      <DesignSystemManager />
    </div>
  );
}
