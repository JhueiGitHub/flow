// /app/obsidian/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import { Note, DesignSystem } from "@prisma/client";
import Sidebar from "./components/sidebar";
import Editor from "./components/editor";
import { useDesignSystem } from "@/contexts/DesignSystemContext";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export default function ObsidianPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const { activeDesignSystem, setActiveDesignSystem } = useDesignSystem();
  const [designSystems, setDesignSystems] = useState<DesignSystem[]>([]);

  useEffect(() => {
    fetchNotes();
    fetchDesignSystems();
    fetchActiveDesignSystem();
  }, []);

  const fetchNotes = async () => {
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
  };

  const fetchDesignSystems = async () => {
    try {
      const response = await fetch("/api/design-systems");
      if (response.ok) {
        const fetchedSystems = await response.json();
        setDesignSystems(fetchedSystems);
      }
    } catch (error) {
      console.error("Error fetching design systems:", error);
    }
  };

  const fetchActiveDesignSystem = async () => {
    try {
      const response = await fetch("/api/active-design-system");
      if (response.ok) {
        const activeSystem = await response.json();
        setActiveDesignSystem(activeSystem);
      }
    } catch (error) {
      console.error("Error fetching active design system:", error);
    }
  };

  const handleUpdateNote = (updatedNote: Note) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) => (note.id === updatedNote.id ? updatedNote : note))
    );
    setSelectedNote(updatedNote);
  };

  const handleSelectDesignSystem = async (designSystemId: string) => {
    try {
      const response = await fetch("/api/active-design-system", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ designSystemId }),
      });
      if (response.ok) {
        const updatedSystem = await response.json();
        setActiveDesignSystem(updatedSystem);
      }
    } catch (error) {
      console.error("Error setting active design system:", error);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
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
          width="228px"
          padding="18px"
        />
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <div
            style={{
              padding: "10px",
              borderBottom: `1px solid ${activeDesignSystem?.overlayBorder}`,
            }}
          >
            <select
              value={activeDesignSystem?.id || ""}
              onChange={(e) => handleSelectDesignSystem(e.target.value)}
              style={{
                backgroundColor: activeDesignSystem?.overlayBackground,
                color: activeDesignSystem?.textPrimary,
                border: `1px solid ${activeDesignSystem?.overlayBorder}`,
                padding: "5px",
                borderRadius: "4px",
              }}
            >
              {designSystems.map((system) => (
                <option key={system.id} value={system.id}>
                  {system.name}
                </option>
              ))}
            </select>
          </div>
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
    </DndProvider>
  );
}
