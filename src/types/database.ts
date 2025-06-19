// Database types for Supabase tables

export interface FileRecord {
  id: string;
  user_id: string;
  file_name: string;
  file_size: number;
  file_url: string;
  content_type: string | null;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      files: {
        Row: FileRecord;
        Insert: Omit<FileRecord, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<FileRecord, 'id' | 'created_at'>> & {
          updated_at?: string;
        };
      };
    };
  };
}
