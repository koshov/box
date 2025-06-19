import { createUploadthing, type FileRouter } from "uploadthing/next";
import { randomUUID } from "crypto";
import { auth0 } from "@/lib/auth0";

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
    .middleware(async () => {
      // Get the authenticated user from Auth0
      const session = await auth0.getSession();
      
      // If no user is authenticated, throw an error
      if (!session || !session.user) {
        throw new Error("Authentication required");
      }
      
      const fileId = randomUUID();
      return { 
        userId: session.user.sub, // Auth0 user ID (subject)
        fileId 
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.ufsUrl);

      return {
        uploadedBy: metadata.userId,
        fileId: metadata.fileId,
        fileUrl: file.ufsUrl,
        // blobUrl: blob.url,
        fileName: file.name,
        fileSize: file.size
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
