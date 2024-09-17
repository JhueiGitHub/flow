// /root/app/api/design-systems/[designSystemId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";

export async function GET(
  req: NextRequest,
  { params }: { params: { designSystemId: string } }
) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const designSystem = await db.designSystem.findUnique({
      where: { id: params.designSystemId, profileId: profile.id },
    });

    if (!designSystem) {
      return new NextResponse("Design system not found", { status: 404 });
    }

    return NextResponse.json(designSystem);
  } catch (error) {
    console.error("[DESIGN_SYSTEM_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { designSystemId: string } }
) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const designSystemData = await req.json();

    const designSystem = await db.designSystem.update({
      where: { id: params.designSystemId, profileId: profile.id },
      data: designSystemData,
    });

    return NextResponse.json(designSystem);
  } catch (error) {
    console.error("[DESIGN_SYSTEM_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { designSystemId: string } }
) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await db.designSystem.delete({
      where: { id: params.designSystemId, profileId: profile.id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[DESIGN_SYSTEM_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
