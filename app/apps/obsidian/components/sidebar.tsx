// /root/app/apps/obsidian/components/Sidebar.tsx

import React, { useState } from "react";
import styles from "../styles/obsidian.module.css";
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

  const createNewFolder = async () => {
    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "New Folder",
          isFolder: true,
          parentId: null,
        }),
      });

      if (response.ok) {
        onUpdateNotes();
      } else {
        console.error("Failed to create new folder");
      }
    } catch (error) {
      console.error("Error creating new folder:", error);
    }
  };

  const renderNotes = (notes: NoteWithChildren[], depth = 0) => {
    return notes.map((note) => (
      <div
        key={note.id}
        style={{ marginLeft: `${depth * 20}px` }}
        className={styles.noteItem}
      >
        {note.isFolder ? (
          <div onClick={() => toggleFolder(note.id)}>
            {expandedFolders.has(note.id) ? "📂" : "📁"} {note.title}
          </div>
        ) : (
          <div onClick={() => onSelectNote(note)}>📄 {note.title}</div>
        )}
        {note.isFolder && expandedFolders.has(note.id) && note.children && (
          <div>{renderNotes(note.children, depth + 1)}</div>
        )}
      </div>
    ));
  };

  return (
    <div className={styles.sidebar}>
      <button onClick={createNewFolder} className={styles.newFolderButton}>
        New Folder
      </button>
      {renderNotes(notes)}
    </div>
  );
}
