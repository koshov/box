import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ auth0: string }> }
) {
  const resolvedParams = await params;
  const { auth0: action } = resolvedParams;

  if (action === 'login') {
    const redirectUri = `${process.env.APP_BASE_URL || 'http://localhost:3000'}/api/auth/callback`;
    const loginUrl = `${process.env.AUTH0_ISSUER_BASE_URL}/authorize?` +
      `response_type=code&` +
      `client_id=${process.env.AUTH0_CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `scope=openid profile email`;

    return NextResponse.redirect(loginUrl);
  }

  if (action === 'logout') {
    const logoutUrl = `${process.env.AUTH0_ISSUER_BASE_URL}/v2/logout?` +
      `client_id=${process.env.AUTH0_CLIENT_ID}&` +
      `returnTo=${encodeURIComponent(process.env.APP_BASE_URL || 'http://localhost:3000')}`;

    const response = NextResponse.redirect(logoutUrl);
    // Clear the session cookie
    response.cookies.delete('appSession');

    return response;
  }

  if (action === 'callback') {
    // Handle the callback from Auth0
    console.log('Debug - Callback received');
    const code = request.nextUrl.searchParams.get('code');
    console.log('Debug - Code from Auth0:', code);

    if (!code) {
      console.log('Debug - No code received from Auth0');
      return NextResponse.redirect(new URL('/?error=no_code', request.url));
    }

    try {
      console.log('Debug - Attempting to exchange code for tokens');
      // Exchange code for tokens
      const tokenResponse = await fetch(`${process.env.AUTH0_ISSUER_BASE_URL}/oauth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          grant_type: 'authorization_code',
          client_id: process.env.AUTH0_CLIENT_ID,
          client_secret: process.env.AUTH0_CLIENT_SECRET,
          code,
          redirect_uri: `${process.env.APP_BASE_URL || 'http://localhost:3000'}/api/auth/callback`,
        }),
      });

      console.log('Debug - Token response status:', tokenResponse.status);
      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        console.log('Debug - Token exchange error:', errorText);
        throw new Error('Failed to exchange code for tokens');
      }

      const tokens = await tokenResponse.json();

      // Get user info
      const userResponse = await fetch(`${process.env.AUTH0_ISSUER_BASE_URL}/userinfo`, {
        headers: {
          'Authorization': `Bearer ${tokens.access_token}`,
        },
      });

      if (!userResponse.ok) {
        throw new Error('Failed to get user info');
      }

      const user = await userResponse.json();

      // Create a simple session (in production, use proper session management)
      const response = NextResponse.redirect(new URL('/upload', request.url));
      response.cookies.set('appSession', JSON.stringify({ user, tokens }), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });

      return response;
    } catch (error) {
      console.error('Auth callback error:', error);
      return NextResponse.redirect(new URL('/?error=auth_failed', request.url));
    }
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 404 });
}