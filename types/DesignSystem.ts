// types/DesignSystem.ts

export interface DesignSystem {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  overlayBackground: string;
  overlayBorder: string;
  textPrimary: string;
  accentColor: string;
  textAccentColor: string;
  primaryFont: string;
  secondaryFont: string;
  editorBackground: string;
  isActive: boolean;
  profileId: string;
  createdAt: Date;
  updatedAt: Date;
  dir?: "ltr" | "rtl"; // Add this line to include the dir property
}
