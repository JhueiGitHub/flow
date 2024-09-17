// /app/lib/FontManager.ts

import { FontFile } from "@prisma/client";
import { db } from "@/lib/db";

export class FontManager {
  static async uploadFont(
    file: File,
    profileId: string
  ): Promise<FontFile | null> {
    try {
      // In a production environment, you would upload the file to a storage service
      // For this example, we'll simulate the upload and store the file locally
      const fileName = `${Date.now()}-${file.name}`;
      const fileUrl = `/uploads/${fileName}`;

      // In a real scenario, you would save the file to the server or a cloud storage service here
      // For this example, we'll skip the actual file saving process

      // Save font file information to the database
      const fontFile = await db.fontFile.create({
        data: {
          name: file.name,
          fileName: fileName,
          fileUrl: fileUrl,
          profileId: profileId,
        },
      });

      return fontFile;
    } catch (error) {
      console.error("Error uploading font:", error);
      return null;
    }
  }

  static async getFontsForProfile(profileId: string): Promise<FontFile[]> {
    try {
      return await db.fontFile.findMany({
        where: { profileId: profileId },
      });
    } catch (error) {
      console.error("Error fetching fonts:", error);
      return [];
    }
  }

  static async deleteFontFile(id: string): Promise<boolean> {
    try {
      const fontFile = await db.fontFile.findUnique({
        where: { id: id },
      });

      if (!fontFile) {
        throw new Error("Font file not found");
      }

      // In a real scenario, you would delete the actual file from your storage service here
      // For this example, we'll skip the file deletion process

      await db.fontFile.delete({
        where: { id: id },
      });

      return true;
    } catch (error) {
      console.error("Error deleting font file:", error);
      return false;
    }
  }
}
