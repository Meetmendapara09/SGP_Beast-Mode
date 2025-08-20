
'use server';

import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { cookies } from 'next/headers';

const applicationSchema = z.object({
  job_id: z.string(),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  resume_url: z.string().url('Invalid URL').optional().or(z.literal('')),
  cover_letter: z.string().optional(),
});

export async function POST(req: NextRequest) {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    // Protect the endpoint by ensuring the user is authenticated
    const {
        data: { session },
        error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
        return NextResponse.json({ message: 'Unauthorized access' }, { status: 401 });
    }

    const body = await req.json();
    const parseResult = applicationSchema.safeParse(body);

    if (!parseResult.success) {
        return NextResponse.json({ message: 'Invalid data', errors: parseResult.error.flatten() }, { status: 400 });
    }

    // Ensure the resume_url is either a valid URL or an empty string
    if (parseResult.data.resume_url && parseResult.data.resume_url !== '') {
        try {
            new URL(parseResult.data.resume_url);
        } catch {
            return NextResponse.json({ message: 'Invalid resume URL' }, { status: 400 });
        }
    }
    const { error } = await supabase
        .from('job_applications')
        .insert([
            { ...parseResult.data }
        ]);

    if (error) {
        console.error('Error submitting application:', error);
        return NextResponse.json({ message: 'Failed to submit application', error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Application submitted successfully!' });
}
