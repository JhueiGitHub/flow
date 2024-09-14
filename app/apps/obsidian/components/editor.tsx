import React from "react";
import { Note } from "@prisma/client";
import { useAutosave } from "@/hooks/debounce";

interface EditorProps {
  note: Note;
  onUpdateNote: (note: Note) => void;
}

export default function Editor({ note, onUpdateNote }: EditorProps) {
  const saveNote = async (content: string) => {
    const response = await fetch(`/api/notes/${note.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    if (response.ok) {
      const updatedNote = await response.json();
      onUpdateNote(updatedNote);
    }
  };

  const { content, setContent, isSaving } = useAutosave({
    onSave: saveNote,
    delay: 1000,
  });

  React.useEffect(() => {
    setContent(note.content);
  }, [note.id, note.content]);

  return (
    <div className="editor">
      <h2>{note.title}</h2>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full h-full p-2 border rounded"
      />
      {isSaving && <div className="saving-indicator">Saving...</div>}
    </div>
  );
}
