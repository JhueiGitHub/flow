// /root/app/apps/obsidian/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "./components/sidebar";
import Editor from "./components/editor";
import { Note, DesignSystem } from "@prisma/client";
import styles from "./styles/obsidian.module.css";

type NoteWithChildren = Note & { children?: NoteWithChildren[] };

const LAST_EDITED_NOTE_KEY = "lastEditedNoteId";
const ACTIVE_DESIGN_SYSTEM_KEY = "activeDesignSystemId";

export default function ObsidianPage() {
  const [notes, setNotes] = useState<NoteWithChildren[]>([]);
  const [selectedNote, setSelectedNote] = useState<NoteWithChildren | null>(
    null
  );
  const [designSystems, setDesignSystems] = useState<DesignSystem[]>([]);
  const [activeDesignSystem, setActiveDesignSystem] =
    useState<DesignSystem | null>(null);

  useEffect(() => {
    fetchNotes();
    fetchDesignSystems();
  }, []);

  useEffect(() => {
    const lastEditedNoteId = localStorage.getItem(LAST_EDITED_NOTE_KEY);
    if (lastEditedNoteId && notes.length > 0) {
      const foundNote = findNoteById(notes, lastEditedNoteId);
      if (foundNote) {
        setSelectedNote(foundNote);
      }
    }
  }, [notes]);

  useEffect(() => {
    const activeDesignSystemId = localStorage.getItem(ACTIVE_DESIGN_SYSTEM_KEY);
    if (activeDesignSystemId && designSystems.length > 0) {
      const foundSystem = designSystems.find(
        (ds) => ds.id === activeDesignSystemId
      );
      if (foundSystem) {
        setActiveDesignSystem(foundSystem);
        applyDesignSystem(foundSystem);
      }
    }
  }, [designSystems]);

  const fetchNotes = async () => {
    try {
      const response = await fetch("/api/notes");
      if (!response.ok) {
        throw new Error("Failed to fetch notes");
      }
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const fetchDesignSystems = async () => {
    try {
      const response = await fetch("/api/design-systems");
      if (!response.ok) {
        throw new Error("Failed to fetch design systems");
      }
      const data = await response.json();
      setDesignSystems(data);
    } catch (error) {
      console.error("Error fetching design systems:", error);
    }
  };

  const findNoteById = (
    notes: NoteWithChildren[],
    id: string
  ): NoteWithChildren | null => {
    for (const note of notes) {
      if (note.id === id) return note;
      if (note.children) {
        const foundInChildren = findNoteById(note.children, id);
        if (foundInChildren) return foundInChildren;
      }
    }
    return null;
  };

  const handleUpdateNotes = () => {
    fetchNotes();
  };

  const handleUpdateNote = (id: string, title: string, content: string) => {
    const updatedNote = { ...selectedNote!, id, title, content };
    setSelectedNote(updatedNote as NoteWithChildren);
    handleUpdateNotes();
  };

  const handleSelectDesignSystem = (designSystemId: string) => {
    const selectedSystem = designSystems.find((ds) => ds.id === designSystemId);
    if (selectedSystem) {
      setActiveDesignSystem(selectedSystem);
      localStorage.setItem(ACTIVE_DESIGN_SYSTEM_KEY, designSystemId);
      applyDesignSystem(selectedSystem);
    } else {
      setActiveDesignSystem(null);
      localStorage.removeItem(ACTIVE_DESIGN_SYSTEM_KEY);
      resetDesignSystem();
    }
  };

  const applyDesignSystem = (designSystem: DesignSystem) => {
    document.documentElement.style.setProperty(
      "--primary-color",
      designSystem.primaryColor
    );
    document.documentElement.style.setProperty(
      "--secondary-color",
      designSystem.secondaryColor
    );
    document.documentElement.style.setProperty(
      "--background-color",
      designSystem.backgroundColor
    );
    document.documentElement.style.setProperty(
      "--editor-background",
      designSystem.editorBackground
    );

    const style = document.createElement("style");
    style.textContent = `
      @font-face {
        font-family: 'PrimaryFont';
        src: url('/fonts/${designSystem.primaryFont}') format('truetype');
      }
      @font-face {
        font-family: 'SecondaryFont';
        src: url('/fonts/${designSystem.secondaryFont}') format('truetype');
      }
    `;
    document.head.appendChild(style);

    document.documentElement.style.setProperty(
      "--primary-font",
      "PrimaryFont, Arial, sans-serif"
    );
    document.documentElement.style.setProperty(
      "--secondary-font",
      "SecondaryFont, Arial, sans-serif"
    );
  };

  const resetDesignSystem = () => {
    document.documentElement.style.removeProperty("--primary-color");
    document.documentElement.style.removeProperty("--secondary-color");
    document.documentElement.style.removeProperty("--background-color");
    document.documentElement.style.removeProperty("--editor-background");
    document.documentElement.style.removeProperty("--primary-font");
    document.documentElement.style.removeProperty("--secondary-font");

    const fontStyles = document.head.querySelectorAll("style");
    fontStyles.forEach((style) => {
      if (style.textContent && style.textContent.includes("@font-face")) {
        style.remove();
      }
    });
  };

  return (
    <div className={styles.container}>
      <Sidebar
        notes={notes}
        onSelectNote={setSelectedNote}
        onUpdateNotes={handleUpdateNotes}
      />
      <div className={styles.mainContent}>
        {selectedNote ? (
          <Editor note={selectedNote} onUpdateNote={handleUpdateNote} />
        ) : (
          <div className={styles.emptyEditor}>Select a note to edit</div>
        )}
      </div>
      <div className={styles.designSystemSelector}>
        <select
          value={activeDesignSystem?.id || ""}
          onChange={(e) => handleSelectDesignSystem(e.target.value)}
          className={styles.designSystemSelect}
        >
          <option value="">Default Design</option>
          {designSystems.map((ds) => (
            <option key={ds.id} value={ds.id}>
              {ds.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
