// app/api/active-design-system/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";

export async function GET(req: NextRequest) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const activeDesignSystem = await db.designSystem.findFirst({
      where: { profileId: profile.id, isActive: true },
    });

    if (!activeDesignSystem) {
      return new NextResponse("No active design system found", { status: 404 });
    }

    return NextResponse.json(activeDesignSystem);
  } catch (error) {
    console.error("[ACTIVE_DESIGN_SYSTEM_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { designSystemId } = await req.json();

    // Deactivate all design systems for the user
    await db.designSystem.updateMany({
      where: { profileId: profile.id },
      data: { isActive: false },
    });

    // Activate the selected design system
    const activeDesignSystem = await db.designSystem.update({
      where: { id: designSystemId, profileId: profile.id },
      data: { isActive: true },
    });

    return NextResponse.json(activeDesignSystem);
  } catch (error) {
    console.error("[ACTIVE_DESIGN_SYSTEM_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
