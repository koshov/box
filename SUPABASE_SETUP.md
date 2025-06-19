# File Upload with Supabase Integration

This project now includes Supabase database integration for storing file metadata.

## Setup Instructions

### 1. Environment Variables

Add the following environment variables to your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 2. Database Setup

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run the SQL script from `database/schema.sql` to create the files table

### 3. File Upload Flow

When a file is uploaded through UploadThing:

1. The file is processed and stored by UploadThing
2. File metadata is automatically saved to the Supabase `files` table
3. The database record includes:
   - `id`: Unique file identifier (UUID)
   - `user_id`: Auth0 user ID from the authenticated session
   - `file_name`: Original filename
   - `file_size`: File size in bytes
   - `file_url`: UploadThing file URL
   - `content_type`: MIME type of the file
   - `created_at`: Timestamp when the file was uploaded
   - `updated_at`: Timestamp when the record was last updated

### 4. Security

- Row Level Security (RLS) is enabled on the files table
- Users can only access their own files
- The policy uses Auth0 user ID for authorization

### 5. Querying Files

To retrieve files for a user:

```typescript
import { createClient } from '@/utils/supabase/server';

const supabase = await createClient();
const { data: files } = await supabase
  .from('files')
  .select('*')
  .order('created_at', { ascending: false });
```

### 6. TypeScript Support

Database types are defined in `src/types/database.ts` and are used throughout the Supabase client for full type safety.

## Features

### File Management Dashboard
- **Home Page Integration**: Logged-in users see their uploaded files on the home page
- **File Statistics**: Overview of total files, storage used, recent uploads, and file type breakdown
- **File Cards**: Each file is displayed with metadata including:
  - File icon based on content type
  - File name and size
  - Upload date
  - Actions: View, Download, Delete

### File Operations
- **View Files**: Click to open files in a new tab
- **Download Files**: Direct download with original filename
- **Delete Files**: Remove files from database (with confirmation)

### Security Features
- **User Isolation**: Users can only see and manage their own files
- **Auth0 Integration**: Seamless authentication with existing Auth0 setup
- **Row Level Security**: Database-level security policies

### API Endpoints
- `GET /api/files` - List user's files (handled by component)
- `DELETE /api/files/[fileId]` - Delete a specific file
