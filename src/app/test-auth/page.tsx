"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function TestAuthPage() {
  type User = {
    id: string;
    name?: string;
    email?: string;
    // Add other user fields as needed
  };

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const checkAuth = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error checking authentication:", error);
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Authentication Test</h1>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Session Status</h2>

          {loading ? (
            <p>Checking...</p>
          ) : user ? (
            <div>
              <p className="text-green-600 font-medium mb-2">✅ Authenticated</p>
              <div className="bg-gray-50 p-4 rounded">
                <pre>{JSON.stringify(user, null, 2)}</pre>
              </div>
            </div>
          ) : (
            <p className="text-red-600 font-medium">❌ Not authenticated</p>
          )}

          <div className="mt-6 space-x-4">
            <button
              onClick={checkAuth}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Refresh Status
            </button>
            <Link
              href="/api/auth/login"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 inline-block"
            >
              Login
            </Link>

            <Link
              href="/api/auth/logout"
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 inline-block"
            >
              Logout
            </Link>

            <Link
              href="/upload"
              className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 inline-block"
            >
              Go to Upload Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
