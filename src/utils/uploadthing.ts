import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";

import type { OurFileRouter } from "../app/api/upload/core";

export const UploadButton = generateUploadButton<OurFileRouter>({
  url: "/api/upload",
});
export const UploadDropzone = generateUploadDropzone<OurFileRouter>({
  url: "/api/upload",
});
