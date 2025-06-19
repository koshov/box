-- Create files table in Supabase
-- Run this SQL in your Supabase SQL editor

CREATE TABLE IF NOT EXISTS files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL, -- Auth0 user ID (sub)
  file_name TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_url TEXT NOT NULL,
  content_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_files_user_id ON files(user_id);

-- Create an index on created_at for faster date-based queries
CREATE INDEX IF NOT EXISTS idx_files_created_at ON files(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE files ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows users to only see their own files
CREATE POLICY "Users can only see their own files" ON files
  FOR ALL USING (auth.jwt() ->> 'sub' = user_id);

-- Alternative policy if you're using Supabase Auth instead of Auth0
-- CREATE POLICY "Users can only see their own files" ON files
--   FOR ALL USING (auth.uid()::text = user_id);
