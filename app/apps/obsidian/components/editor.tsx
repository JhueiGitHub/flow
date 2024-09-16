// /app/obsidian/components/Editor.tsx

import React, { useState, useEffect, useCallback } from "react";
import { Note } from "@prisma/client";
import { useDesignSystem } from "@/contexts/DesignSystemContext";
import styles from "../styles/obsidian.module.css";
import { debounce } from "@/app/utils/debounce";

interface EditorProps {
  note: Note;
  onUpdateNote: (updatedNote: Note) => void;
  padding: string;
  setIsSaving: (isSaving: boolean) => void;
}

export default function Editor({
  note,
  onUpdateNote,
  padding,
  setIsSaving,
}: EditorProps) {
  const [content, setContent] = useState(note.content || "");
  const { activeDesignSystem } = useDesignSystem();

  useEffect(() => {
    setContent(note.content || "");
  }, [note.id, note.content]);

  const debouncedUpdateNote = useCallback(
    debounce((updatedContent: string) => {
      setIsSaving(true);
      onUpdateNote({ ...note, content: updatedContent });
      setTimeout(() => setIsSaving(false), 1000);
    }, 1000),
    [note, onUpdateNote, setIsSaving]
  );

  const handleContentChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newContent = e.target.value;
      setContent(newContent);
      debouncedUpdateNote(newContent);
    },
    [debouncedUpdateNote]
  );

  return (
    <div
      className={styles.editor}
      style={{ padding, backgroundColor: activeDesignSystem?.editorBackground }}
    >
      <h1 style={{ color: activeDesignSystem?.accentColor }}>{note.title}</h1>
      <textarea
        value={content}
        onChange={handleContentChange}
        style={{
          backgroundColor: "transparent",
          color: activeDesignSystem?.textPrimary,
          fontFamily: activeDesignSystem?.secondaryFont,
          width: "100%",
          height: "calc(100% - 40px)",
          border: "none",
          outline: "none",
          resize: "none",
        }}
      />
    </div>
  );
}
