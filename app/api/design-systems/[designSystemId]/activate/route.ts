// /root/app/api/design-systems/[designSystemId]/activate/route.ts

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";

export async function POST(
  req: NextRequest,
  { params }: { params: { designSystemId: string } }
) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Deactivate all design systems for this profile
    await db.designSystem.updateMany({
      where: { profileId: profile.id },
      data: { isActive: false },
    });

    // Activate the selected design system
    const activatedDesignSystem = await db.designSystem.update({
      where: { id: params.designSystemId, profileId: profile.id },
      data: { isActive: true },
    });

    return NextResponse.json(activatedDesignSystem);
  } catch (error) {
    console.error("[DESIGN_SYSTEM_ACTIVATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
