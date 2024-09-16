// /app/api/notes/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { noteId: string } }
) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { title, content, parentId } = await req.json();
    const noteId = params.noteId;

    const updatedNote = await db.note.update({
      where: { id: noteId, profileId: profile.id },
      data: {
        title: title !== undefined ? title : undefined,
        content: content !== undefined ? content : undefined,
        parentId: parentId !== undefined ? parentId : undefined,
      },
    });

    return NextResponse.json(updatedNote);
  } catch (error) {
    console.error("[NOTE_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
