import { createUploadthing, type FileRouter } from "uploadthing/next";
import { put } from "@vercel/blob";
import { randomUUID } from "crypto";

const f = createUploadthing();

export const ourFileRouter = {
  fileUploader: f({
    "image/jpeg": { maxFileSize: "2MB" },
    "image/png": { maxFileSize: "2MB" },
    "image/gif": { maxFileSize: "2MB" },
    "image/svg+xml": { maxFileSize: "2MB" },
    "text/plain": { maxFileSize: "2MB" },
    "text/markdown": { maxFileSize: "2MB" },
    "text/csv": { maxFileSize: "2MB" }
  })
    .middleware(async ({ req }) => {
      const fileId = randomUUID();
      return { userId: "user-123", fileId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);

      try {
        const blob = await put(`uploads/${metadata.fileId}-${file.name}`, file.url, {
          access: "public",
        });

        console.log("File stored in Vercel Blob:", blob.url);

        return {
          uploadedBy: metadata.userId,
          fileId: metadata.fileId,
          fileUrl: file.url,
          blobUrl: blob.url,
          fileName: file.name,
          fileSize: file.size
        };
      } catch (error) {
        console.error("Error storing file in Vercel Blob:", error);
        return {
          uploadedBy: metadata.userId,
          fileId: metadata.fileId,
          fileUrl: file.url,
          fileName: file.name,
          fileSize: file.size
        };
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
