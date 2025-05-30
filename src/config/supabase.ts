// Import the createClient function from the Supabase JavaScript library.
import { createClient } from '@supabase/supabase-js';

// Retrieve the Supabase URL from the environment variables.
// import.meta.env is a Vite-specific way to access environment variables.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// Retrieve the Supabase anonymous key from the environment variables.
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if the Supabase URL is missing or not a string.
if (!supabaseUrl || typeof supabaseUrl !== 'string') {
  // If it's missing or invalid, throw an error to stop execution.
  throw new Error('VITE_SUPABASE_URL environment variable is missing or invalid');
}

// Check if the Supabase anonymous key is missing or not a string.
if (!supabaseAnonKey || typeof supabaseAnonKey !== 'string') {
  // If it's missing or invalid, throw an error to stop execution.
  throw new Error('VITE_SUPABASE_ANON_KEY environment variable is missing or invalid');
}

// Validate if the retrieved Supabase URL is a valid URL format.
try {
  // Attempt to create a new URL object. If the URL is invalid, this will throw an error.
  new URL(supabaseUrl);
} catch (error) {
  // If an error occurs (meaning the URL is invalid), throw a new error with a descriptive message.
  throw new Error(`Invalid VITE_SUPABASE_URL format: ${supabaseUrl}`);
}

// Create and export the Supabase client instance using the retrieved URL and anonymous key.
// This 'supabase' object will be used throughout the application to interact with the Supabase backend.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);