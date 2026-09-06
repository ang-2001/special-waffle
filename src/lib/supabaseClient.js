import { createClient } from '@supabase/supabase-js';

// Public by design — real access control lives in Postgres RLS, not in
// keeping these values secret.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error(
        'Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY. ' +
        'Copy .env.example to .env.local and fill in real values from the ' +
        'Supabase dashboard (Project Settings → API).'
    );
}

export const supabase = createClient(supabaseUrl, supabasePublishableKey);

export default supabase;
