import { createClient } from '@/utils/supabase/server';
import { auth0 } from "@/lib/auth0";
import type { FileRecord } from '@/types/database';
import FileCard from './FileCard';

export default async function FilesList() {
  // Get the current user session
  const session = await auth0.getSession();
  
  if (!session || !session.user) {
    return null; // This component should only render for authenticated users
  }

  try {
    // Create Supabase client and fetch user's files
    const supabase = await createClient();
    const { data: files, error } = await supabase
      .from('files')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching files:', error);
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700">Error loading files. Please try again later.</p>
        </div>
      );
    }

    if (!files || files.length === 0) {
      return (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 mb-6 text-center">
          <div className="text-6xl mb-4">📁</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No files uploaded yet</h3>
          <p className="text-gray-500 mb-4">Get started by uploading your first file</p>
          <a
            href="/upload"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Upload Files
          </a>
        </div>
      );
    }

    return (
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Your Files</h2>
          <span className="text-sm text-gray-500">{files.length} file{files.length !== 1 ? 's' : ''}</span>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {files.map((file: FileRecord) => (
            <FileCard key={file.id} file={file} />
          ))}
        </div>
        
        <div className="mt-6 text-center">
          <a
            href="/upload"
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Upload More Files
          </a>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Unexpected error fetching files:', error);
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <p className="text-red-700">Something went wrong loading your files. Please try again later.</p>
      </div>
    );
  }
}
