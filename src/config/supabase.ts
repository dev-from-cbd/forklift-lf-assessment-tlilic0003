// Import the createClient function from Supabase JavaScript client library
import { createClient } from '@supabase/supabase-js';

// Get the Supabase URL from environment variables (set in Vite)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// Get the anonymous API key from environment variables (set in Vite)
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if the Supabase URL exists and is a string
if (!supabaseUrl || typeof supabaseUrl !== 'string') {
  // Throw an error if the URL is missing or invalid
  throw new Error('VITE_SUPABASE_URL environment variable is missing or invalid');
}

// Check if the anonymous API key exists and is a string
if (!supabaseAnonKey || typeof supabaseAnonKey !== 'string') {
  // Throw an error if the API key is missing or invalid
  throw new Error('VITE_SUPABASE_ANON_KEY environment variable is missing or invalid');
}

// Validate that the Supabase URL is in a proper URL format
try {
  // Attempt to create a URL object to validate the format
  new URL(supabaseUrl);
} catch (error) {
  // Throw an error with the invalid URL if validation fails
  throw new Error(`Invalid VITE_SUPABASE_URL format: ${supabaseUrl}`);
}

// Create and export the Supabase client instance with the URL and API key
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Define and export a function to get all users (intended for admin use only)
export const getAllUsers = async () => {
  // Call the 'get_all_users' Remote Procedure Call (RPC) function defined in Supabase
  const { data, error } = await supabase.rpc('get_all_users');
  // If there's an error, throw it to be handled by the caller
  if (error) throw error;
  // Return the user data if successful
  return data;
};