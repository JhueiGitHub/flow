// types/index.ts

import { Note, DesignSystem, Profile } from "@prisma/client";

export type NoteWithChildren = Note & { children?: NoteWithChildren[] };

export interface DesignSystemWithFonts extends DesignSystem {
  primaryFontFile?: FontFile;
  secondaryFontFile?: FontFile;
}

export interface FontFile {
  id: string;
  name: string;
  fileName: string;
  fileUrl: string;
}

export interface UserProfile extends Profile {
  activeDesignSystem?: DesignSystem;
}
