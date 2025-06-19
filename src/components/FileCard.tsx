'use client';

import { useState } from 'react';
import type { FileRecord } from '@/types/database';

interface FileCardProps {
  file: FileRecord;
}

// Helper function to format file size
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Helper function to format date
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Helper function to get file type icon
function getFileIcon(contentType: string | null): string {
  if (!contentType) return '📄';
  
  if (contentType.startsWith('image/')) return '🖼️';
  if (contentType.startsWith('text/')) return '📝';
  if (contentType.includes('pdf')) return '📕';
  if (contentType.includes('video/')) return '🎥';
  if (contentType.includes('audio/')) return '🎵';
  if (contentType.includes('zip') || contentType.includes('archive')) return '📦';
  
  return '📄';
}

export default function FileCard({ file }: FileCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${file.file_name}"?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/files/${file.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Refresh the page to update the file list
        window.location.reload();
      } else {
        const error = await response.text();
        alert('Failed to delete file: ' + error);
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('Failed to delete file. Please try again.');
    }
    setIsDeleting(false);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{getFileIcon(file.content_type)}</span>
          <div className="min-w-0 flex-1">
            <h3 className="font-medium text-gray-900 truncate" title={file.file_name}>
              {file.file_name}
            </h3>
            <p className="text-sm text-gray-500">{formatFileSize(file.file_size)}</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-2 text-sm text-gray-600">
        <div>
          <span className="font-medium">Type:</span> {file.content_type || 'Unknown'}
        </div>
        <div>
          <span className="font-medium">Uploaded:</span> {formatDate(file.created_at)}
        </div>
      </div>
      
      <div className="mt-4 flex space-x-2">
        <a
          href={file.file_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
        >
          View
        </a>
        <a
          href={file.file_url}
          download={file.file_name}
          className="flex-1 text-center px-3 py-2 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
        >
          Download
        </a>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDeleting ? '...' : 'Delete'}
        </button>
      </div>
    </div>
  );
}
