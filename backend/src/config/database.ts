import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or anon key is not set; using mock data');
}

// Dummy Supabase client when credentials are missing
const dummySupabase = {
  from: () => ({
    select: () => ({
      order: () => ({ limit: () => ({ data: [], error: null }) }),
    }),
    insert: () => ({ select: () => ({ single: () => ({ data: null, error: null }) }) }),
  }),
} as any;

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : dummySupabase;
