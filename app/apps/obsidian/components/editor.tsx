// /app/obsidian/components/Editor.tsx

import React, { useState, useEffect, useCallback } from "react";
import { Note } from "@prisma/client";
import { useDesignSystem } from "@/contexts/DesignSystemContext";
import styles from "../styles/obsidian.module.css";

interface EditorProps {
  note: Note;
  onUpdateNote: (updatedNote: Note) => void;
  padding: string;
}

export default function Editor({ note, onUpdateNote, padding }: EditorProps) {
  const [content, setContent] = useState(note.content || "");
  const { activeDesignSystem } = useDesignSystem();

  useEffect(() => {
    setContent(note.content || "");
  }, [note.id, note.content]);

  const handleContentChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setContent(e.target.value);
    },
    []
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (content !== note.content) {
        onUpdateNote({ ...note, content });
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [content, note, onUpdateNote]);

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
        }}
      />
    </div>
  );
}
