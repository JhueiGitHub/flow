import React from "react";

interface StatusIndicatorProps {
  isSaving: boolean;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ isSaving }) => {
  return (
    <div
      style={{
        width: "10px",
        height: "10px",
        borderRadius: "50%",
        backgroundColor: isSaving ? "green" : "gray",
        transition: "background-color 0.3s ease",
      }}
    />
  );
};

export default StatusIndicator;
