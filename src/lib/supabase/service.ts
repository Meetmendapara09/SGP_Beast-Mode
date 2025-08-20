// IMPORTANT: This client is only for server-side use and for public, read-only data.
// It uses the SERVICE_ROLE_KEY, which bypasses RLS.
// Do not use this for user-specific data or mutations unless you are absolutely sure about the security implications.

import { createClient } from '@supabase/supabase-js'

// Note: supabase-js is bugged and asks for the anon key even when the service role key is provided.
// The anon key is not actually used in this case.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || (() => { throw new Error('NEXT_PUBLIC_SUPABASE_URL is not defined') })();
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || (() => { throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined') })();
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || (() => { throw new Error('SUPABASE_SERVICE_ROLE_KEY is not defined') })();


export const serviceClient = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false
    }
});
