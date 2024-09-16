// /app/api/notes/route.ts

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";

export async function GET(req: NextRequest) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const notes = await db.note.findMany({
      where: { profileId: profile.id },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(notes);
  } catch (error) {
    console.error("[NOTES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { title, content, isFolder, parentId } = await req.json();

    const note = await db.note.create({
      data: {
        profileId: profile.id,
        title,
        content: content || "",
        isFolder: isFolder || false,
        parentId: parentId || null,
      },
    });

    return NextResponse.json(note);
  } catch (error) {
    console.error("[NOTES_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
