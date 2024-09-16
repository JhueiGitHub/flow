// // lib/utils.ts

// import { NoteWithChildren } from "@/types";
// import { DesignSystem } from "@/types"; // Add this import at the top of the file

// export function createNoteTree(notes: NoteWithChildren[]): NoteWithChildren[] {
//   const noteMap: { [key: string]: NoteWithChildren } = {};
//   const rootNotes: NoteWithChildren[] = [];

//   notes.forEach((note) => {
//     noteMap[note.id] = { ...note, children: [] };
//   });

//   notes.forEach((note) => {
//     if (note.parentId) {
//       const parent = noteMap[note.parentId];
//       if (parent) {
//         parent.children?.push(noteMap[note.id]);
//       }
//     } else {
//       rootNotes.push(noteMap[note.id]);
//     }
//   });

//   return rootNotes;
// }

// export function applyDesignSystem(designSystem: DesignSystem) {
//   Object.entries(designSystem).forEach(([key, value]) => {
//     if (
//       typeof value === "string" &&
//       !["id", "name", "profileId", "createdAt", "updatedAt"].includes(key)
//     ) {
//       document.documentElement.style.setProperty(`--${key}`, value);
//     }
//   });
// }
