// app/page.tsx

/*
Functionality:
- Serves as the entry point for the Orion OS
- Handles initial user authentication and profile creation
- Redirects to the appropriate page based on user state (new user setup or dashboard)
- Creates the default "Zenith" design system for new users
*/

import { redirect } from "next/navigation";
import { initialProfile } from "@/lib/initial-profile";
import Desktop from "./os/components/Desktop";
import { db } from "@/lib/db";

const Home = async () => {
  const profile = await initialProfile();

  if (!profile) {
    return redirect("/sign-in");
  }

  const existingDesignSystem = await db.designSystem.findFirst({
    where: {
      profileId: profile.id,
    },
  });

  if (!existingDesignSystem) {
    // Create default "Zenith" design system
    await db.designSystem.create({
      data: {
        name: "Zenith",
        profileId: profile.id,
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
    return redirect("/setup");
  }

  return <Desktop />;
};

export default Home;
