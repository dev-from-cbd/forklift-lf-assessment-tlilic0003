// Import the Supabase client creation function from the Supabase library
import { createClient } from '@supabase/supabase-js';

// Retrieve the Supabase project URL from environment variables (securely stored)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

// Retrieve the Supabase API key (anon public key) from environment variables
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if the necessary environment variables are present
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Initialize the Supabase client with the project URL and public API key
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Export the configured Supabase client for use throughout the project
export default supabase;
