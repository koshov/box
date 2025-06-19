"use client";

import { useState, useEffect } from "react";
import { UploadDropzone } from "@/utils/uploadthing";
import Link from "next/link";

interface UploadedFile {
  fileId: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  uploadedBy: string;
  blobUrl?: string;
}

export default function UploadPage() {
  interface User {
    name?: string;
    email?: string;
    [key: string]: unknown;
  }
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(async (response) => {
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          setLoading(false);
        } else {
          window.location.replace('/api/auth/login');
        }
      })
      .catch(() => {
        window.location.replace('/api/auth/login');
      });
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* User Info Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              File Upload Center
            </h1>
            {user && (
              <p className="text-lg text-gray-600">
                Welcome back, {user.name || user.email || 'User'}!
              </p>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {user && (
              <div className="text-right">
                <p className="text-sm text-gray-600">{user.email}</p>
                <Link
                  href="/api/auth/logout"
                  className="text-sm text-indigo-600 hover:text-indigo-800 underline"
                >
                  Logout
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            File Upload Center
          </h1>
          <p className="text-lg text-gray-600">
            Upload files securely to cloud storage. Supports JPG, PNG, GIF, SVG, TXT, MD, and CSV files (max 2MB).
          </p>
        </div>

        {/* Upload Area */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Upload Files
            </h2>
            <p className="text-gray-600">
              Drag and drop files here or click to browse
            </p>
          </div>

          <div className="relative">
            <UploadDropzone
              endpoint="fileUploader"
              onClientUploadComplete={(res) => {
                console.log("Files: ", res);
                if (res) {
                  const newFiles = res.map((file) => ({
                    fileId: file.serverData?.fileId || "unknown",
                    fileName: file.serverData?.fileName || file.name,
                    fileUrl: file.serverData?.fileUrl || file.ufsUrl,
                    fileSize: file.serverData?.fileSize || file.size,
                    uploadedBy: file.serverData?.uploadedBy || "unknown",
                  }));
                  setUploadedFiles((prev) => [...prev, ...newFiles]);
                }
                setIsUploading(false);
              }}
              onUploadError={(error: Error) => {
                alert(`ERROR! ${error.message}`);
                setIsUploading(false);
              }}
              onUploadBegin={() => {
                setIsUploading(true);
              }}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-400 transition-colors"
              appearance={{
                button:
                  "bg-indigo-600 text-white font-semibold py-2 px-4 rounded shadow hover:bg-indigo-700 hover:shadow-lg transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2",
              }}
            />

            {isUploading && (
              <div className="absolute inset-0 bg-white bg-opacity-75 rounded-lg flex items-center justify-center">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                  <span className="text-indigo-600 font-medium">Uploading...</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Uploaded Files List */}
        {uploadedFiles.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Uploaded Files ({uploadedFiles.length})
            </h2>

            <div className="grid gap-4">
              {uploadedFiles.map((file, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {file.fileName.toLowerCase().match(/\.(jpg|jpeg|png|gif|svg)$/) ? (
                          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                            </svg>
                          </div>
                        ) : (
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>

                      <div>
                        <h3 className="font-medium text-gray-900">{file.fileName}</h3>
                        <p className="text-sm text-gray-500">{formatFileSize(file.fileSize)}</p>
                        <p className="text-xs text-gray-400">ID: {file.fileId}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <a
                        href={file.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                          <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                        </svg>
                        View
                      </a>

                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(file.fileUrl);
                          alert('File URL copied to clipboard!');
                        }}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                          <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                        </svg>
                        Copy URL
                      </button>

                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(file.fileId);
                          alert('File ID copied to clipboard!');
                        }}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Copy ID
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-2">
            Upload Guidelines
          </h3>
          <ul className="text-blue-800 space-y-1">
            <li>• Supported file types: JPG, PNG, GIF, SVG, TXT, MD, CSV</li>
            <li>• Maximum file size: 2MB per file</li>
            <li>• Each uploaded file receives a unique identifier</li>
            <li>• Files are stored securely in cloud storage</li>
            <li>• You can view and share uploaded files using the provided URLs</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
