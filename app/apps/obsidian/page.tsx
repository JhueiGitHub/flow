// ObsidianApp.tsx (or your main Obsidian component)

"use client";

import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "./components/sidebar";
import Editor from "./components/editor";
import { Note } from "@prisma/client";
import { useDesignSystem } from "@/contexts/DesignSystemContext";

const ObsidianApp: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const { activeDesignSystem } = useDesignSystem();

  // Fetch notes from API
  const fetchNotes = useCallback(async () => {
    try {
      const response = await fetch("/api/notes");
      if (response.ok) {
        const fetchedNotes = await response.json();
        setNotes(fetchedNotes);
        if (fetchedNotes.length > 0 && !selectedNote) {
          setSelectedNote(fetchedNotes[0]);
        }
      } else {
        console.error("Error fetching notes:", await response.text());
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  }, [selectedNote]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleUpdateNote = useCallback(async (updatedNote: Note) => {
    try {
      const response = await fetch(`/api/notes/${updatedNote.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedNote),
      });
      if (response.ok) {
        const updated = await response.json();
        setNotes((prevNotes) =>
          prevNotes.map((note) => (note.id === updated.id ? updated : note))
        );
        setSelectedNote(updated);
      } else {
        console.error("Error updating note:", await response.text());
      }
    } catch (error) {
      console.error("Error updating note:", error);
    }
  }, []);

  const handleMoveNote = useCallback(
    async (noteId: string, newParentId: string | null) => {
      try {
        const response = await fetch(`/api/notes/${noteId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ parentId: newParentId }),
        });
        if (response.ok) {
          fetchNotes();
        } else {
          console.error("Error moving note:", await response.text());
        }
      } catch (error) {
        console.error("Error moving note:", error);
      }
    },
    [fetchNotes]
  );

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        backgroundColor: activeDesignSystem?.backgroundColor,
      }}
    >
      <Sidebar
        notes={notes}
        onSelectNote={setSelectedNote}
        onUpdateNotes={fetchNotes}
        onMoveNote={handleMoveNote}
        width="228px"
        padding="18px"
      />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {selectedNote ? (
          <Editor
            note={selectedNote}
            onUpdateNote={handleUpdateNote}
            padding="30px"
          />
        ) : (
          <div
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: activeDesignSystem?.textPrimary,
            }}
          >
            Select a note to edit
          </div>
        )}
      </div>
    </div>
  );
};

export default ObsidianApp;
