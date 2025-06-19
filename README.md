# Box - Secure File Upload & Sharing

A Next.js file upload and sharing application with UploadThing integration, Auth0 authentication, and Supabase database.

## Features

- **Secure File Storage**: Files are stored using UploadThing (UFS) with presigned URL access
- **Authentication**: Auth0 integration for user management  
- **Database**: Supabase for file metadata storage
- **File Security**: UFS URLs are hidden; only file owners get presigned URLs
- **File Management**: Upload, view, download, and delete operations
- **File Types**: Support for images (JPG, PNG, GIF, SVG), text files (TXT, MD, CSV)

## Security Features

### Presigned URL Access
- Direct UFS URLs are never exposed to users
- Temporary presigned URLs generated on-demand (1 hour expiration)
- Only file owners can access their files
- All file access requests verify ownership

For detailed security implementation, see [FILE_SECURITY.md](./FILE_SECURITY.md).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Setup

1. **Environment Variables**: Configure Auth0, Supabase, and UploadThing credentials
2. **Database Setup**: Run the schema from `database/schema.sql` in Supabase
3. **Authentication**: Set up Auth0 application and configure callbacks

See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed setup instructions.

## API Endpoints

- `GET /api/files/[fileId]` - Generate presigned URL for file access
- `DELETE /api/files/[fileId]` - Delete file (owner only)
- `POST /api/upload` - UploadThing file upload handler
- `/api/auth/*` - Auth0 authentication routes

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Authentication**: Auth0
- **Database**: Supabase (PostgreSQL)
- **File Storage**: UploadThing (UFS)
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
