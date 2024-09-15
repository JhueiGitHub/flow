// /root/app/page.tsx

import { redirect } from "next/navigation";
import { initialProfile } from "@/lib/initial-profile";
import Desktop from "./os/components/Desktop";
import { db } from "@/lib/db";

const Home = async () => {
  // Create or retrieve the user's profile and ensure initial design system exists
  const profile = await initialProfile();

  const existingDesignSystem = await db.designSystem.findFirst({
    where: {
      profileId: profile.id,
    },
  });

  if (existingDesignSystem) {
    return redirect("/dashboard");
  }

  // Render the Desktop component
  return <Desktop />;
};

export default Home;
