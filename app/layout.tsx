// app/layout.tsx

/*
Functionality:
- Provides the root layout for the entire Orion OS
- Wraps the application with necessary providers (Clerk for authentication, DesignSystemProvider for theming)
- Includes global styles and meta tags
*/

import { ClerkProvider } from "@clerk/nextjs";
import { DesignSystemProvider } from "@/contexts/DesignSystemContext";
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Orion OS",
  description: "A revolutionary operating system in the cloud",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body>
          <DesignSystemProvider>{children}</DesignSystemProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
