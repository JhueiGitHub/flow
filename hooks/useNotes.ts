// hooks/useNotes.ts

import { useState, useEffect } from "react";
import { NoteWithChildren } from "@/types";

export const useNotes = () => {
  const [notes, setNotes] = useState<NoteWithChildren[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchNotes = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/notes");
      if (!response.ok) throw new Error("Failed to fetch notes");
      const data = await response.json();
      setNotes(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An error occurred"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return { notes, isLoading, error, refetch: fetchNotes };
};
