import { useState, useEffect, useRef } from "react";

interface AutosaveOptions {
  onSave: (content: string) => Promise<void>;
  delay?: number;
}

export function useAutosave({ onSave, delay = 1000 }: AutosaveOptions) {
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (content !== "") {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setIsSaving(true);
      timeoutRef.current = setTimeout(async () => {
        await onSave(content);
        setIsSaving(false);
      }, delay);
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [content, delay, onSave]);

  return { content, setContent, isSaving };
}
