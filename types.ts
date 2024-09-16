import { Note, DesignSystem, Profile } from "@prisma/client";

export type NoteWithChildren = Note & { children?: NoteWithChildren[] };

export interface DesignSystemWithFonts extends DesignSystem {
  primaryFont: string;
  secondaryFont: string;
}

export interface UserProfile extends Profile {
  activeDesignSystem?: DesignSystem;
}
