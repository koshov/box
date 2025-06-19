import { createClient } from '@/utils/supabase/server';
import { auth0 } from "@/lib/auth0";

// Helper function to format file size
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export default async function FileStats() {
  // Get the current user session
  const session = await auth0.getSession();
  
  if (!session || !session.user) {
    return null;
  }

  try {
    // Create Supabase client and fetch user's file statistics
    const supabase = await createClient();
    const { data: files, error } = await supabase
      .from('files')
      .select('file_size, content_type, created_at')
      .eq('user_id', session.user.sub);

    if (error) {
      console.error('Error fetching file stats:', error);
      return null;
    }

    if (!files || files.length === 0) {
      return null;
    }

    // Calculate statistics
    const totalFiles = files.length;
    const totalSize = files.reduce((sum, file) => sum + file.file_size, 0);
    const imageFiles = files.filter(file => file.content_type?.startsWith('image/')).length;
    const textFiles = files.filter(file => file.content_type?.startsWith('text/')).length;
    const otherFiles = totalFiles - imageFiles - textFiles;

    // Get recent uploads (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentFiles = files.filter(file => new Date(file.created_at) > sevenDaysAgo).length;

    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Storage Overview</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{totalFiles}</div>
            <div className="text-sm text-gray-600">Total Files</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{formatFileSize(totalSize)}</div>
            <div className="text-sm text-gray-600">Storage Used</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{recentFiles}</div>
            <div className="text-sm text-gray-600">Recent (7 days)</div>
          </div>
          
          <div className="text-center">
            <div className="flex justify-center space-x-1 mb-1">
              <span className="text-lg">🖼️</span>
              <span className="text-lg">📝</span>
              <span className="text-lg">📄</span>
            </div>
            <div className="text-xs text-gray-600">
              {imageFiles} · {textFiles} · {otherFiles}
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching file stats:', error);
    return null;
  }
}
