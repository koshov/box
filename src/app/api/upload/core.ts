import { createUploadthing, type FileRouter } from "uploadthing/next";
import { randomUUID } from "crypto";
import { auth0 } from "@/lib/auth0";
import { createClient } from "@/utils/supabase/server";

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

      // Create Supabase client
      const supabase = await createClient();

      // Prepare file data for database
      const fileData = {
        id: metadata.fileId,
        user_id: metadata.userId,
        file_name: file.name,
        file_size: file.size,
        file_url: file.ufsUrl,
        content_type: file.type,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Insert file record into database
      const { data, error } = await supabase
        .from('files')
        .insert(fileData)
        .select()
        .single();

      if (error) {
        console.error('Error saving file to database:', error);
        // You might want to handle this error differently based on your needs
        throw new Error('Failed to save file metadata to database');
      }

      console.log('File metadata saved to database:', data);

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
