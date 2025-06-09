import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || typeof supabaseUrl !== 'string') {
  throw new Error('VITE_SUPABASE_URL environment variable is missing or invalid');
}

if (!supabaseAnonKey || typeof supabaseAnonKey !== 'string') {
  throw new Error('VITE_SUPABASE_ANON_KEY environment variable is missing or invalid');
}

// Validate URL format
try {
  new URL(supabaseUrl);
} catch (error) {
  throw new Error(`Invalid VITE_SUPABASE_URL format: ${supabaseUrl}`);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);