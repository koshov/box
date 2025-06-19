import { auth0 } from "@/lib/auth0";
import FilesList from "@/components/FilesList";
import FileStats from "@/components/FileStats";
import './globals.css';

export default async function Home() {
  // Fetch the user session
  const session = await auth0.getSession();

  // If no session, show sign-up and login button
  if (!session) {
    return (
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Box</h1>
          <p className="text-lg text-gray-600 mb-8">Secure file storage and sharing made simple</p>
          
          <div className="flex gap-4 justify-center mb-8">
            <a href="/auth/login?screen_hint=signup">
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Sign up
              </button>
            </a>
            <a href="/auth/login">
              <button className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium">
                Log in
              </button>
            </a>
          </div>
        </div>
      </main>
    );
  }

  // If session exists, show a welcome message and files list
  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {session.user.name}!
        </h1>
        <div className="flex items-center space-x-4">
          <a
            href="/upload"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            Upload Files
          </a>
          <a
            href="/auth/logout"
            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Log out
          </a>
        </div>
      </div>
      
      <FileStats />
      <FilesList />
    </main>
  );
}