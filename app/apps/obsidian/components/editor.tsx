// /root/app/apps/obsidian/components/Editor.tsx

import React from "react";
import styles from "../styles/obsidian.module.css";
import { Note } from "@prisma/client";

interface EditorProps {
  note: Note | null;
  onUpdateNote: (id: string, title: string, content: string) => void;
}

const Editor: React.FC<EditorProps> = ({ note, onUpdateNote }) => {
  if (!note) return null;

  return (
    <div className={styles.editor}>
      <input
        type="text"
        value={note.title}
        onChange={(e) => onUpdateNote(note.id, e.target.value, note.content)}
        className={styles.titleInput}
      />
      <textarea
        value={note.content}
        onChange={(e) => onUpdateNote(note.id, note.title, e.target.value)}
        className={styles.contentArea}
      />
    </div>
  );
};

export default Editor;
