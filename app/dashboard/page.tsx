import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import Desktop from "../os/components/Desktop";

const DashboardPage = async () => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/");
  }

  const designSystem = await db.designSystem.findFirst({
    where: {
      profileId: profile.id,
    },
  });

  if (!designSystem) {
    return redirect("/");
  }

  return <Desktop />;
};

export default DashboardPage;
