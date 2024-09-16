// /app/obsidian/components/Sidebar.tsx

import React, { useState, useCallback, useEffect, useRef } from "react";
import { Note } from "@prisma/client";
import { useDesignSystem } from "@/contexts/DesignSystemContext";
import ContextMenu from "./ContextMenu";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

interface SidebarProps {
  notes: Note[];
  onSelectNote: (note: Note) => void;
  onUpdateNotes: () => void;
  width: string;
  padding: string;
}

interface DraggableItemProps {
  note: Note;
  depth: number;
  onDrop: (draggedId: string, targetId: string) => void;
  onContextMenu: (e: React.MouseEvent, note: Note) => void;
  onClick: () => void;
  isExpanded: boolean;
}

const DraggableItem: React.FC<DraggableItemProps> = ({
  note,
  depth,
  onDrop,
  onContextMenu,
  onClick,
  isExpanded,
}) => {
  const { activeDesignSystem } = useDesignSystem();

  const [{ isDragging }, drag] = useDrag({
    type: "NOTE",
    item: { id: note.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: "NOTE",
    drop: (item: { id: string }) => {
      if (item.id !== note.id) {
        onDrop(item.id, note.id);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const ref = useRef(null);
  drag(drop(ref));

  return (
    <div
      ref={ref}
      style={{
        marginLeft: `${depth * 20}px`,
        opacity: isDragging ? 0.5 : 1,
        cursor: "pointer",
        color: note.isFolder
          ? activeDesignSystem?.accentColor
          : activeDesignSystem?.textPrimary,
        backgroundColor: isOver
          ? activeDesignSystem?.overlayBackground
          : "transparent",
      }}
      onClick={onClick}
      onContextMenu={(e) => onContextMenu(e, note)}
    >
      {note.isFolder ? (isExpanded ? "📂" : "📁") : "📄"} {note.title}
    </div>
  );
};

const Sidebar: React.FC<SidebarProps> = ({
  notes,
  onSelectNote,
  onUpdateNotes,
  width,
  padding,
}) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set()
  );
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    note: Note | null;
  } | null>(null);
  const { activeDesignSystem } = useDesignSystem();

  useEffect(() => {
    const savedExpanded = localStorage.getItem("expandedFolders");
    if (savedExpanded) {
      setExpandedFolders(new Set(JSON.parse(savedExpanded)));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "expandedFolders",
      JSON.stringify(Array.from(expandedFolders))
    );
  }, [expandedFolders]);

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

  const toggleFolder = useCallback((folderId: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  }, []);

  const handleDrop = useCallback(
    async (draggedId: string, targetId: string) => {
      try {
        const response = await fetch(`/api/notes/${draggedId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ parentId: targetId }),
        });
        if (response.ok) {
          onUpdateNotes();
        } else {
          console.error("Error moving note:", await response.text());
        }
      } catch (error) {
        console.error("Error moving note:", error);
      }
    },
    [onUpdateNotes]
  );

  const renderNotes = useCallback(
    (notesToRender: Note[], depth = 0) => {
      return notesToRender.map((note) => (
        <React.Fragment key={note.id}>
          <DraggableItem
            note={note}
            depth={depth}
            onDrop={handleDrop}
            onContextMenu={handleContextMenu}
            onClick={() =>
              note.isFolder ? toggleFolder(note.id) : onSelectNote(note)
            }
            isExpanded={expandedFolders.has(note.id)}
          />
          {note.isFolder &&
            expandedFolders.has(note.id) &&
            renderNotes(
              notes.filter((n) => n.parentId === note.id),
              depth + 1
            )}
        </React.Fragment>
      ));
    },
    [
      notes,
      expandedFolders,
      handleContextMenu,
      handleDrop,
      onSelectNote,
      toggleFolder,
    ]
  );

  return (
    <DndProvider backend={HTML5Backend}>
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
        {renderNotes(notes.filter((n) => !n.parentId))}
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
    </DndProvider>
  );
};

export default Sidebar;
