// ContextMenu.tsx

import React from "react";
import { Note } from "@prisma/client";
import { useDesignSystem } from "@/contexts/DesignSystemContext";

interface ContextMenuProps {
  x: number;
  y: number;
  note: Note | null;
  onCreateNote: () => void;
  onCreateFolder: () => void;
  onRename: () => void;
  onDelete: () => void;
  onClose: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  x,
  y,
  note,
  onCreateNote,
  onCreateFolder,
  onRename,
  onDelete,
  onClose,
}) => {
  const { activeDesignSystem } = useDesignSystem();

  return (
    <div
      style={{
        position: "fixed",
        top: y,
        left: x,
        backgroundColor: activeDesignSystem?.overlayBackground,
        border: `1px solid ${activeDesignSystem?.overlayBorder}`,
        borderRadius: "4px",
        padding: "8px",
        zIndex: 1000,
        color: activeDesignSystem?.textPrimary,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div onClick={onCreateNote}>New Note</div>
      <div onClick={onCreateFolder}>New Folder</div>
      {note && (
        <>
          <div onClick={onRename}>Rename</div>
          <div onClick={onDelete}>Delete</div>
        </>
      )}
    </div>
  );
};

export default ContextMenu;
