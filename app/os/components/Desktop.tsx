"use client";

import React, { useState } from "react";
import DockManager from "./DockManager";
import AppWindow from "./AppWindow";
import HiddenNavbar from "./HiddenNavbar";

interface OpenWindow {
  id: string;
  title: string;
  appName: string;
}

interface WindowProps {
  id: string;
  title: string;
  appName: string;
  onClose: () => void;
}

const Desktop: React.FC = () => {
  const [openWindows, setOpenWindows] = useState<OpenWindow[]>([]);

  const toggleApp = (appName: string) => {
    setOpenWindows((prev) => {
      const isOpen = prev.some((window) => window.appName === appName);
      if (isOpen) {
        return prev.filter((window) => window.appName !== appName);
      } else {
        const newWindow: OpenWindow = {
          id: `window-${Date.now()}`,
          title: appName, // You might want to customize this title
          appName: appName,
        };
        return [...prev, newWindow];
      }
    });
  };

  const handleCloseWindow = (id: string) => {
    console.log(`Closing window ${id}`);
    setOpenWindows((prev) => prev.filter((window) => window.id !== id));
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <video
        autoPlay
        loop
        muted
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/media/siamese.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <HiddenNavbar />
      {openWindows.map((window) => (
        <AppWindow
          key={window.id}
          id={window.id}
          title={window.title}
          appName={window.appName}
          onClose={() => handleCloseWindow(window.id)}
        />
      ))}
      <DockManager toggleApp={toggleApp} />
    </div>
  );
};

export default Desktop;
