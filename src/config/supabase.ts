// Import createClient function from Supabase client library
import { createClient } from '@supabase/supabase-js';

// Get Supabase URL from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// Get Supabase anonymous key from environment variables
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate that Supabase URL exists and is a string
if (!supabaseUrl || typeof supabaseUrl !== 'string') {
  throw new Error('VITE_SUPABASE_URL environment variable is missing or invalid');
}

// Validate that Supabase anonymous key exists and is a string
if (!supabaseAnonKey || typeof supabaseAnonKey !== 'string') {
  throw new Error('VITE_SUPABASE_ANON_KEY environment variable is missing or invalid');
}

// Validate URL format by attempting to create a URL object
// This ensures the Supabase URL has a valid format
try {
  new URL(supabaseUrl);
} catch (error) {
  throw new Error(`Invalid VITE_SUPABASE_URL format: ${supabaseUrl}`);
}

// Create and export the Supabase client instance
// This will be used throughout the application to interact with Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);