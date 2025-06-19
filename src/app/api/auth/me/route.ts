import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Check if user is authenticated
  const sessionCookie = request.cookies.get('appSession');

  console.log('Debug - All cookies:', request.cookies.getAll());
  console.log('Debug - Session cookie:', sessionCookie);

  if (!sessionCookie) {
    console.log('Debug - No session cookie found');
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const session = JSON.parse(sessionCookie.value);
    console.log('Debug - Session parsed successfully:', session.user);
    return NextResponse.json(session.user);
  } catch (error) {
    console.log('Debug - Error parsing session:', error);
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
  }
}
