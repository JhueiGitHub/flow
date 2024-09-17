// app/apps/flow/components/FontLoader.tsx

"use client";

import React, { useEffect } from "react";
import { useDesignSystem } from "@/contexts/DesignSystemContext";

export const FontLoader: React.FC = () => {
  const { activeDesignSystem } = useDesignSystem();

  useEffect(() => {
    console.log("Active Design System:", activeDesignSystem); // Log for debugging

    const loadFont = async (fontUrl: string, fontFamily: string) => {
      try {
        const font = new FontFace(fontFamily, `url(${fontUrl})`);
        const loadedFont = await font.load();
        document.fonts.add(loadedFont);
        document.body.style.setProperty(
          `--${fontFamily.toLowerCase()}`,
          fontFamily
        );
        console.log(`${fontFamily} loaded successfully`);
      } catch (error) {
        console.error(`Error loading ${fontFamily}:`, error);
      }
    };

    if (activeDesignSystem?.primaryFontUrl) {
      loadFont(activeDesignSystem.primaryFontUrl, "CustomPrimaryFont");
    }

    if (activeDesignSystem?.secondaryFontUrl) {
      loadFont(activeDesignSystem.secondaryFontUrl, "CustomSecondaryFont");
    }
  }, [activeDesignSystem]);

  return null;
};
