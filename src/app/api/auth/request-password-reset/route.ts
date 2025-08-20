
import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ message: 'Email is required' }, { status: 400 });
  }

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  // Get the redirect URL from the request headers
  const redirectUrl = req.headers.get('x-redirect-url') || '';
  if (!redirectUrl) {
    return NextResponse.json({ message: 'Redirect URL is required' }, { status: 400 });
  }
  const redirectTo = new URL('/login', req.nextUrl.origin).toString();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });

  if (error) {
    console.error('Password Reset Error:', error);
    return NextResponse.json({
      message: 'If an account with that email exists, a password reset link has been sent.',
    });
  }

  return NextResponse.json({
    message: 'If an account with that email exists, a password reset link has been sent.',
  });
}
