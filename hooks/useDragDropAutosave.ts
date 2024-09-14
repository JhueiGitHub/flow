// hooks/useDragDropAutosave.ts

import { useState, useEffect, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";

interface DragDropAutosaveOptions {
  onSave: (id: string, newParentId: string | null) => Promise<void>;
  delay?: number;
}

export function useDragDropAutosave({
  onSave,
  delay = 1000,
}: DragDropAutosaveOptions) {
  const [isSaving, setIsSaving] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleDrop = (id: string, newParentId: string | null) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsSaving(true);
    timeoutRef.current = setTimeout(async () => {
      await onSave(id, newParentId);
      setIsSaving(false);
    }, delay);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "NOTE",
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "NOTE",
    drop: (item: { id: string }, monitor) => {
      const didDrop = monitor.didDrop();
      if (didDrop) {
        return;
      }
      handleDrop(item.id, null); // Dropped at root level
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return { isDragging, isOver, drag, drop, isSaving };
}
