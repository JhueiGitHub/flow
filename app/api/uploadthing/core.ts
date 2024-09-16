// /app/api/uploadthing/core.ts

import { createUploadthing, type FileRouter } from "uploadthing/next";
import { currentProfile } from "@/lib/current-profile";

const f = createUploadthing();

export const ourFileRouter = {
  fontUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      const profile = await currentProfile();
      if (!profile) throw new Error("Unauthorized");
      return { profileId: profile.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for profileId:", metadata.profileId);
      console.log("file url", file.url);
      return { fileUrl: file.url, fileKey: file.key };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
