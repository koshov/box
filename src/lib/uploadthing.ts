import { UTApi } from "uploadthing/server";

// Initialize UTApi instance
export const utapi = new UTApi();

// Helper function to extract file key from UFS URL
export function extractFileKeyFromUfsUrl(ufsUrl: string): string {
  // UFS URLs typically have format: https://ufs.uploadthing.com/f/{fileKey}
  const match = ufsUrl.match(/\/f\/([^?]+)/);
  if (!match) {
    throw new Error("Invalid UFS URL format");
  }
  return match[1];
}

// Helper function to generate presigned URL
export async function generatePresignedUrl(ufsUrl: string, expiresIn: number = 3600): Promise<string> {
  const fileKey = extractFileKeyFromUfsUrl(ufsUrl);
  const result = await utapi.generateSignedURL(fileKey, { expiresIn });
  return result.ufsUrl;
}
