// /root/app/api/upload-font/route.ts

import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;
    const fontType = data.get("fontType") as string;

    if (!file || !fontType) {
      return NextResponse.json(
        { error: "No file uploaded or missing font type" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileName = `${fontType}_${Date.now()}-${file.name}`;
    const filePath = path.join(process.cwd(), "public", "fonts", fileName);

    await writeFile(filePath, buffer);

    const fontFile = await db.fontFile.create({
      data: {
        name: file.name,
        fileName: fileName,
        fileUrl: `/fonts/${fileName}`,
        profileId: profile.id, // Associate the font with the current profile
      },
    });

    return NextResponse.json(
      {
        fileUrl: fontFile.fileUrl,
        fileName: fontFile.name,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving font file:", error);
    return NextResponse.json(
      { error: "Error saving font file" },
      { status: 500 }
    );
  }
}
