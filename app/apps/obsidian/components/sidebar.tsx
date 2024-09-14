// /root/app/obsidian/components/Sidebar.tsx

import React, { useState } from "react";
import { Note } from "@prisma/client";

type NoteWithChildren = Note & { children?: NoteWithChildren[] };

interface SidebarProps {
  notes: NoteWithChildren[];
  onSelectNote: (note: NoteWithChildren) => void;
  onUpdateNotes: () => void;
}

export default function Sidebar({
  notes,
  onSelectNote,
  onUpdateNotes,
}: SidebarProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set()
  );
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    parentId: string | null;
  }>({ visible: false, x: 0, y: 0, parentId: null });

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(folderId)) {
        newSet.delete(folderId);
      } else {
        newSet.add(folderId);
      }
      return newSet;
    });
  };

  const handleContextMenu = (e: React.MouseEvent, parentId: string | null) => {
    e.preventDefault();
    setContextMenu({ visible: true, x: e.clientX, y: e.clientY, parentId });
  };

  const createItem = async (isFolder: boolean) => {
    const title = isFolder ? "New Folder" : "New Note";
    const response = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, isFolder, parentId: contextMenu.parentId }),
    });

    if (response.ok) {
      onUpdateNotes();
    }
    setContextMenu({ visible: false, x: 0, y: 0, parentId: null });
  };

  const handleDragStart = (e: React.DragEvent, noteId: string) => {
    e.dataTransfer.setData("noteId", noteId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const noteId = e.dataTransfer.getData("noteId");
    if (noteId === targetId) return; // Prevent dropping on itself

    const response = await fetch(`/api/notes/${noteId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ parentId: targetId }),
    });

    if (response.ok) {
      onUpdateNotes();
    }
  };

  const renderNotes = (notes: NoteWithChildren[], depth = 0) => {
    return notes.map((note) => (
      <div
        key={note.id}
        style={{ marginLeft: `${depth * 20}px` }}
        className={note.isFolder ? "folder-item" : "note-item"}
        onContextMenu={(e) => handleContextMenu(e, note.id)}
        draggable
        onDragStart={(e) => handleDragStart(e, note.id)}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, note.id)}
      >
        {note.isFolder ? (
          <div>
            <span onClick={() => toggleFolder(note.id)}>
              {expandedFolders.has(note.id) ? "📂" : "📁"} {note.title}
            </span>
            {expandedFolders.has(note.id) && note.children && (
              <div>{renderNotes(note.children, depth + 1)}</div>
            )}
          </div>
        ) : (
          <div onClick={() => onSelectNote(note)}>📄 {note.title}</div>
        )}
      </div>
    ));
  };

  const renderContextMenu = () => {
    if (!contextMenu.visible) return null;

    return (
      <div
        style={{
          position: "absolute",
          top: contextMenu.y,
          left: contextMenu.x,
          background: "white",
          border: "1px solid #ccc",
          borderRadius: "4px",
          padding: "8px",
          zIndex: 1000,
        }}
      >
        <div onClick={() => createItem(false)} className="cursor-pointer">
          New Note
        </div>
        <div onClick={() => createItem(true)} className="cursor-pointer">
          New Folder
        </div>
      </div>
    );
  };

  return (
    <div
      className="sidebar"
      onContextMenu={(e) => handleContextMenu(e, null)}
      onClick={() =>
        setContextMenu({ visible: false, x: 0, y: 0, parentId: null })
      }
    >
      <h2 className="text-xl font-bold mb-4">Notes</h2>
      {renderNotes(notes)}
      {renderContextMenu()}
    </div>
  );
}
