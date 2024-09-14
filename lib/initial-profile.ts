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
    // Check if the profile already has a design system
    const existingDesignSystem = await db.designSystem.findFirst({
      where: {
        profileId: profile.id,
      },
    });

    if (!existingDesignSystem) {
      // Create initial design system if it doesn't exist
      await createInitialDesignSystem(profile.id);
    }

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

  // Create initial design system for the new profile
  await createInitialDesignSystem(newProfile.id);

  return newProfile;
};

async function createInitialDesignSystem(profileId: string) {
  await db.designSystem.create({
    data: {
      name: "Default Design System",
      primaryColor: "#000000",
      secondaryColor: "#ffffff",
      backgroundColor: "#f0f0f0",
      primaryFont: "Arial",
      secondaryFont: "Helvetica",
      profileId: profileId,
    },
  });
}
