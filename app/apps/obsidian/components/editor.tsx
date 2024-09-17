// app/apps/obsidian/components/Editor.tsx

import React, { useState, useEffect, useCallback } from "react";
import { Note } from "@prisma/client";
import { useDesignSystem } from "@/contexts/DesignSystemContext";
import { debounce } from "@/app/utils/debounce";

interface EditorProps {
  note: Note;
  onUpdateNote: (updatedNote: Note) => void;
  padding: string;
}

const Editor: React.FC<EditorProps> = ({ note, onUpdateNote, padding }) => {
  const [content, setContent] = useState(note.content || "");
  const { activeDesignSystem } = useDesignSystem();

  useEffect(() => {
    setContent(note.content || "");
  }, [note.id, note.content]);

  const debouncedUpdateNote = useCallback(
    debounce((updatedContent: string) => {
      onUpdateNote({ ...note, content: updatedContent });
    }, 1000),
    [note, onUpdateNote]
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
      style={{
        padding,
        backgroundColor: activeDesignSystem?.editorBackground,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h1
        style={{
          color: activeDesignSystem?.accentColor,
          fontFamily: "CustomPrimaryFont, var(--primary-font), sans-serif",
        }}
      >
        {note.title}
      </h1>
      <textarea
        value={content}
        onChange={handleContentChange}
        style={{
          backgroundColor: "transparent",
          color: activeDesignSystem?.textPrimary,
          fontFamily: "CustomSecondaryFont, var(--secondary-font), sans-serif",
          flex: 1,
          border: "none",
          outline: "none",
          resize: "none",
        }}
      />
    </div>
  );
};

export default Editor;
