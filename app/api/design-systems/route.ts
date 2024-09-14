// /app/api/design-systems/route.ts

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";

export async function GET() {
  try {
    // Preserved functionality: Fetch all design systems
    const designSystems = await db.designSystem.findMany();
    console.log("Fetched design systems:", designSystems);
    return NextResponse.json(designSystems);
  } catch (error) {
    console.error("Error fetching design systems:", error);
    return NextResponse.json(
      { error: "Error fetching design systems" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    console.log("Received data for new design system:", data);

    // New functionality: Find the profile associated with the current user
    const profile = await db.profile.findUnique({
      where: { userId: userId },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // New functionality: Create design system associated with the user's profile
    const newDesignSystem = await db.designSystem.create({
      data: {
        ...data,
        profileId: profile.id,
      },
    });

    console.log("Created new design system:", newDesignSystem);
    return NextResponse.json(newDesignSystem, { status: 201 });
  } catch (error) {
    console.error("Error creating design system:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Error creating design system", details: errorMessage },
      { status: 500 }
    );
  }
}
