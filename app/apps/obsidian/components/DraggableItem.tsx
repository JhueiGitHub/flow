// app/apps/obsidian/components/DraggableItem.tsx
import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import styles from "../styles/obsidian.module.css";
import { Note } from "@prisma/client";

type NoteWithChildren = Note & { children?: NoteWithChildren[] };

interface DraggableItemProps {
  note: NoteWithChildren;
  depth: number;
  isExpanded: boolean;
  onToggleFolder: (folderId: string) => void;
  onSelectNote: (note: NoteWithChildren) => void;
  onMoveNote: (noteId: string, newParentId: string | null) => void;
  children?: React.ReactNode;
}

const DraggableItem: React.FC<DraggableItemProps> = ({
  note,
  depth,
  isExpanded,
  onToggleFolder,
  onSelectNote,
  onMoveNote,
  children,
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: "NOTE",
    item: { id: note.id, isFolder: note.isFolder, parentId: note.parentId },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: "NOTE",
    drop: (
      item: { id: string; isFolder: boolean; parentId: string | null },
      monitor
    ) => {
      if (item.id !== note.id && item.parentId !== note.id) {
        onMoveNote(item.id, note.isFolder ? note.id : note.parentId);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const ref = useRef(null);
  drag(drop(ref));

  const handleClick = () => {
    if (note.isFolder) {
      onToggleFolder(note.id);
    } else {
      onSelectNote(note);
    }
  };

  const handleDrop = (item: {
    id: string;
    isFolder: boolean;
    parentId: string | null;
  }) => {
    if (item.id !== note.id && item.parentId !== note.id) {
      onMoveNote(item.id, note.isFolder ? note.id : note.parentId);
    }
  };

  return (
    <div
      ref={ref}
      style={{ marginLeft: `${depth * 20}px` }}
      className={`${styles.noteItem} ${isDragging ? styles.dragging : ""} ${
        isOver ? styles.dropTarget : ""
      }`}
    >
      <div onClick={handleClick}>
        {note.isFolder ? (
          <span>
            {isExpanded ? "📂" : "📁"} {note.title}
          </span>
        ) : (
          <span>📄 {note.title}</span>
        )}
      </div>
      {children}
    </div>
  );
};

export default DraggableItem;
