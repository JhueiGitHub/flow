// contexts/DesignSystemContext.tsx

"use client";

import React, { createContext, useState, useEffect, useContext } from "react";
import { DesignSystem } from "@prisma/client";

interface DesignSystemContextType {
  activeDesignSystem: DesignSystem | null;
  setActiveDesignSystem: React.Dispatch<
    React.SetStateAction<DesignSystem | null>
  >;
}

const DesignSystemContext = createContext<DesignSystemContextType>({
  activeDesignSystem: null,
  setActiveDesignSystem: () => {},
});

export const DesignSystemProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [activeDesignSystem, setActiveDesignSystem] =
    useState<DesignSystem | null>(null);

  useEffect(() => {
    // Fetch active design system on mount
    const fetchActiveDesignSystem = async () => {
      const response = await fetch("/api/active-design-system");
      if (response.ok) {
        const data = await response.json();
        setActiveDesignSystem(data);
      }
    };
    fetchActiveDesignSystem();
  }, []);

  return (
    <DesignSystemContext.Provider
      value={{ activeDesignSystem, setActiveDesignSystem }}
    >
      {children}
    </DesignSystemContext.Provider>
  );
};

export const useDesignSystem = () => useContext(DesignSystemContext);
