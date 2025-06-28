// Import Supabase client from config file
import { supabase } from '../config/supabase';

// Function to check if user is authenticated
// Returns the current session if exists, null otherwise
export const checkAuth = async () => {
  // Get current session from Supabase auth
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};

// Function to sanitize user input to prevent XSS attacks
// Takes a string input and returns sanitized version
export const sanitizeInput = (input: string): string => {
  return input
    // Remove HTML tags by stripping < and > characters
    .replace(/[<>]/g, '')
    // Trim whitespace from both ends
    .trim();
};

// Function to validate required environment variables
// Throws error if any required variables are missing
export const validateEnvironmentVariables = () => {
  // List of required environment variables
  const requiredVars = [
    'VITE_SUPABASE_URL', // Supabase project URL
    'VITE_SUPABASE_ANON_KEY', // Supabase anonymous/public key
    'JWT_SECRET' // Secret for JWT tokens
  ];

  // Filter out variables that are not set
  const missingVars = requiredVars.filter(
    varName => !import.meta.env[varName]
  );

  // Throw error if any variables are missing
  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`
    );
  }
};