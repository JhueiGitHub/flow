// lib/initial-profile.ts

import { currentUser } from "@clerk/nextjs";
import { db } from "@/lib/db";

export const initialProfile = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const profile = await db.profile.findUnique({
    where: { userId: user.id },
  });

  if (profile) {
    return profile;
  }

  const newProfile = await db.profile.create({
    data: {
      userId: user.id,
      name: `${user.firstName} ${user.lastName}`,
      imageUrl: user.imageUrl,
      email: user.emailAddresses[0].emailAddress,
    },
  });

  // Create default "Zenith" design system
  await db.designSystem.create({
    data: {
      name: "Zenith",
      profileId: newProfile.id,
      isActive: true,
      primaryColor: "#000000",
      secondaryColor: "#FFFFFF",
      backgroundColor: "#292929",
      overlayBackground: "#01020369",
      overlayBorder: "#CCCCCC18",
      textPrimary: "#708394",
      accentColor: "#2a9a79",
      textAccentColor: "#8069c4",
      primaryFont: "Arial",
      secondaryFont: "Helvetica",
      editorBackground: "#292929",
    },
  });

  return newProfile;
};
