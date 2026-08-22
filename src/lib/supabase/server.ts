import 'server-only';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
export function getSupabaseServer() {
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;
  if (!supabaseSecretKey) throw new Error('SUPABASE_SECRET_KEY is required for server-only operations');
  return createClient(supabaseUrl, supabaseSecretKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}