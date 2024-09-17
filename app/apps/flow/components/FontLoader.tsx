// /app/apps/flow/components/FontLoader.tsx

"use client";

import React, { useEffect } from "react";
import { useDesignSystem } from "@/contexts/DesignSystemContext";

export const FontLoader: React.FC = () => {
  const { activeDesignSystem } = useDesignSystem();

  useEffect(() => {
    if (activeDesignSystem?.primaryFontUrl) {
      const font = new FontFace(
        "CustomPrimaryFont",
        `url(${activeDesignSystem.primaryFontUrl})`
      );
      font.load().then((loadedFont) => {
        document.fonts.add(loadedFont);
        document.body.style.setProperty("--primary-font", "CustomPrimaryFont");
      });
    }
    if (activeDesignSystem?.secondaryFontUrl) {
      const font = new FontFace(
        "CustomSecondaryFont",
        `url(${activeDesignSystem.secondaryFontUrl})`
      );
      font.load().then((loadedFont) => {
        document.fonts.add(loadedFont);
        document.body.style.setProperty(
          "--secondary-font",
          "CustomSecondaryFont"
        );
      });
    }
  }, [activeDesignSystem]);

  return null;
};
