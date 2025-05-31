// Import Supabase client from the config directory
import { supabase } from '../config/supabase';

// Function to check if user is authenticated
// Returns the current session if user is logged in
export const checkAuth = async () => {
  // Get current session from Supabase authentication
  const { data: { session } } = await supabase.auth.getSession();
  // Return the session object
  return session;
};

// Function to sanitize user input by removing potentially dangerous characters
// Takes a string input and returns a sanitized version
export const sanitizeInput = (input: string): string => {
  // Remove HTML tags (< and > characters) and trim whitespace
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .trim(); // Remove leading/trailing whitespace
};

// Function to validate required environment variables
// Throws an error if any required variables are missing
export const validateEnvironmentVariables = () => {
  // List of required environment variables
  const requiredVars = [
    'VITE_SUPABASE_URL', // Supabase project URL
    'VITE_SUPABASE_ANON_KEY', // Supabase anonymous key
    'JWT_SECRET' // Secret key for JWT tokens
  ];

  // Filter to find missing variables
  const missingVars = requiredVars.filter(
    varName => !import.meta.env[varName] // Check if variable exists
  );

  // If any variables are missing, throw an error
  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`
    );
  }
};