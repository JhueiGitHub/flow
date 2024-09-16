import { useState, useEffect, useCallback } from "react";
import { debounce } from "lodash";

interface UseAutosaveOptions {
  content: string;
  onSave: (content: string) => Promise<void>;
  delay?: number;
}

export const useAutosave = ({
  content,
  onSave,
  delay = 1000,
}: UseAutosaveOptions) => {
  const [isSaving, setIsSaving] = useState(false);

  const debouncedSave = useCallback(
    debounce(async (contentToSave: string) => {
      setIsSaving(true);
      await onSave(contentToSave);
      setIsSaving(false);
    }, delay),
    [onSave, delay]
  );

  useEffect(() => {
    debouncedSave(content);
  }, [content, debouncedSave]);

  return { isSaving };
};
