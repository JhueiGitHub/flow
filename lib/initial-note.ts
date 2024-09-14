// /lib/initial-note.ts

import { db } from "@/lib/db";

export const initialNote = async (profileId: string) => {
  const existingNote = await db.note.findFirst({
    where: {
      profileId: profileId,
    },
  });

  if (existingNote) {
    return existingNote;
  }

  const newNote = await db.note.create({
    data: {
      title: "Welcome to Your Obsidian Clone",
      content: "This is your first note. Start writing or create new notes!",
      isFolder: false,
      profileId: profileId,
    },
  });

  return newNote;
};
