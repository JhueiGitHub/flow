// Sidebar.tsx

import React, { useState, useCallback } from "react";
import ObsidianFileTree from "./ObsidianFileTree";
import { useDesignSystem } from "@/contexts/DesignSystemContext";
import { Note } from "@prisma/client";
import ContextMenu from "./ContextMenu";

interface SidebarProps {
  notes: Note[];
  onSelectNote: (note: Note) => void;
  onUpdateNotes: () => void;
  onMoveNote: (noteId: string, newParentId: string | null) => void;
  width: string;
  padding: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  notes,
  onSelectNote,
  onUpdateNotes,
  onMoveNote,
  width,
  padding,
}) => {
  const { activeDesignSystem } = useDesignSystem();
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    note: Note | null;
  } | null>(null);

  // Context menu functionality preserved
  const handleContextMenu = useCallback(
    (e: React.MouseEvent, note: Note | null) => {
      e.preventDefault();
      setContextMenu({ x: e.clientX, y: e.clientY, note });
    },
    []
  );

  const handleCloseContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  const handleCreateItem = useCallback(
    async (isFolder: boolean) => {
      try {
        const response = await fetch("/api/notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: isFolder ? "New Folder" : "New Note",
            isFolder,
            parentId: contextMenu?.note?.id,
          }),
        });
        if (response.ok) {
          onUpdateNotes();
        }
      } catch (error) {
        console.error("Error creating item:", error);
      }
      handleCloseContextMenu();
    },
    [contextMenu, onUpdateNotes]
  );

  const handleDeleteItem = useCallback(async () => {
    if (contextMenu?.note) {
      try {
        const response = await fetch(`/api/notes/${contextMenu.note.id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          onUpdateNotes();
        }
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    }
    handleCloseContextMenu();
  }, [contextMenu, onUpdateNotes]);

  const handleRenameItem = useCallback(async () => {
    if (contextMenu?.note) {
      const newTitle = prompt("Enter new name:", contextMenu.note.title);
      if (newTitle && newTitle !== contextMenu.note.title) {
        try {
          const response = await fetch(`/api/notes/${contextMenu.note.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: newTitle }),
          });
          if (response.ok) {
            onUpdateNotes();
          }
        } catch (error) {
          console.error("Error renaming item:", error);
        }
      }
    }
    handleCloseContextMenu();
  }, [contextMenu, onUpdateNotes]);

  return (
    <div
      style={{
        width,
        padding,
        height: "100%",
        overflowY: "auto",
        backgroundColor: activeDesignSystem?.backgroundColor,
        color: activeDesignSystem?.textPrimary,
      }}
      onContextMenu={(e) => handleContextMenu(e, null)}
      onClick={handleCloseContextMenu}
    >
      <ObsidianFileTree
        notes={notes}
        onSelectNote={onSelectNote}
        onUpdateNotes={onUpdateNotes}
        onMoveNote={onMoveNote}
      />
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          note={contextMenu.note}
          onCreateNote={() => handleCreateItem(false)}
          onCreateFolder={() => handleCreateItem(true)}
          onRename={handleRenameItem}
          onDelete={handleDeleteItem}
          onClose={handleCloseContextMenu}
        />
      )}
    </div>
  );
};

export default Sidebar;
