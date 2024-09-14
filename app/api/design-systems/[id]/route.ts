// /app/api/design-systems/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const designSystem = await db.designSystem.findUnique({
      where: { id: String(id) },
    });

    if (!designSystem) {
      return NextResponse.json(
        { error: "Design system not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(designSystem);
  } catch (error) {
    console.error("Error fetching design system:", error);
    return NextResponse.json(
      { error: "Error fetching design system" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const data = await request.json();

    const updatedDesignSystem = await db.designSystem.update({
      where: { id: String(id) },
      data,
    });

    return NextResponse.json(updatedDesignSystem);
  } catch (error) {
    console.error("Error updating design system:", error);
    return NextResponse.json(
      { error: "Error updating design system" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    await db.designSystem.delete({
      where: { id: String(id) },
    });

    return NextResponse.json({ message: "Design system deleted successfully" });
  } catch (error) {
    console.error("Error deleting design system:", error);
    return NextResponse.json(
      { error: "Error deleting design system" },
      { status: 500 }
    );
  }
}
