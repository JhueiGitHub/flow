// app/api/design-systems/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";

export async function GET(req: NextRequest) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const designSystems = await db.designSystem.findMany({
      where: { profileId: profile.id },
    });

    return NextResponse.json(designSystems);
  } catch (error) {
    console.error("[DESIGN_SYSTEMS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const designSystemData = await req.json();

    const designSystem = await db.designSystem.create({
      data: {
        ...designSystemData,
        profileId: profile.id,
      },
    });

    return NextResponse.json(designSystem);
  } catch (error) {
    console.error("[DESIGN_SYSTEMS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
