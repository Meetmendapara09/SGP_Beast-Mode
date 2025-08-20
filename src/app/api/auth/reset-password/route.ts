
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { hash } from 'bcryptjs';
import { cookies } from 'next/headers';

// when the user clicks the link in the email. This endpoint is not directly called in that flow.
// It remains as a reference or for potential future custom flows.

export async function POST(req: NextRequest) {
  try {
    const { token, newPassword } = await req.json();

    if (!token || !newPassword) {
      return NextResponse.json({ message: 'Token and new password are required' }, { status: 400 });
    }
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    // Exchange the token for a session
    const { data: sessionData, error: sessionError } = await supabase.auth.exchangeCodeForSession(token);

    if (sessionError || !sessionData?.user) {
      console.error('Error exchanging token for session:', sessionError);
      return NextResponse.json({ message: 'Invalid or expired token' }, { status: 400 });
    }

    // Update the user's password
    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });

    if (updateError) {
      console.error('Error updating user password:', updateError);
      return NextResponse.json({ message: 'Failed to update password' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Password has been reset successfully.' }, { status: 200 });

  } catch (error) {
    console.error('Reset Password Error:', error);
    return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
  }
}
