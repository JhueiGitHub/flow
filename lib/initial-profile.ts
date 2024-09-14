import { currentUser, redirectToSignIn } from "@clerk/nextjs";

import { db } from "@/lib/db";

export const initialProfile = async () => {
  const user = await currentUser();

  if (!user) {
    return redirectToSignIn();
  }

  const profile = await db.profile.findUnique({
    where: {
      userId: user.id,
    },
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

  // Create initial design system
  await createInitialDesignSystem(newProfile.id);

  return newProfile;
};

async function createInitialDesignSystem(profileId: string) {
  await db.designSystem.create({
    data: {
      name: "Default Design System",
      primaryColor: "#000000",
      secondaryColor: "#ffffff",
      backgroundColor: "rgba(47, 47, 47, 0.5)", // Semi-transparent dark background
      editorBackground: "rgba(0, 0, 0, 0.5)", // Semi-transparent black for editor
      primaryFont: "Arial",
      secondaryFont: "Helvetica",
      profileId: profileId,
    },
  });
}
