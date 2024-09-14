// /root/app/api/upload-font/route.ts

import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const file: File | null = data.get("font") as unknown as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const fileName = `${Date.now()}-${file.name}`;
  const filePath = path.join(process.cwd(), "public", "fonts", fileName);

  try {
    await writeFile(filePath, buffer);
    const fontFile = await prisma.fontFile.create({
      data: {
        name: file.name,
        fileName: fileName,
        fileUrl: `/fonts/${fileName}`,
      },
    });
    return NextResponse.json(fontFile, { status: 201 });
  } catch (error) {
    console.error("Error saving font file:", error);
    return NextResponse.json(
      { error: "Error saving font file" },
      { status: 500 }
    );
  }
}
