// /root/app/page.tsx

import { initialProfile } from "@/lib/initial-profile";
import Desktop from "./os/components/Desktop";

const Home = async () => {
  // Create or retrieve the user's profile and ensure initial design system exists
  await initialProfile();

  // Render the Desktop component
  return <Desktop />;
};

export default Home;
