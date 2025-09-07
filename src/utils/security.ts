// Import the Supabase client instance from the configuration file
import { supabase } from '../config/supabase';

/**
 * Checks if the user is authenticated by retrieving the current session
 * @returns The current session object if authenticated, null otherwise
 */
export const checkAuth = async () => {
  // Destructure the session from the Supabase auth response
  const { data: { session } } = await supabase.auth.getSession();
  // Return the session object (null if not authenticated)
  return session;
};

/**
 * Sanitizes user input by removing potentially dangerous characters
 * @param input - The string input to sanitize
 * @returns A sanitized version of the input string
 */
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags that could be used for XSS attacks
    .trim(); // Remove leading and trailing whitespace
};

/**
 * Validates that all required environment variables are present
 * @throws Error if any required environment variables are missing
 */
export const validateEnvironmentVariables = () => {
  // Define an array of required environment variable names
  const requiredVars = [
    'VITE_SUPABASE_URL',      // Supabase project URL
    'VITE_SUPABASE_ANON_KEY', // Supabase anonymous API key
    'JWT_SECRET'              // Secret key for JWT token generation/validation
  ];

  // Filter the array to find any missing environment variables
  const missingVars = requiredVars.filter(
    varName => !import.meta.env[varName] // Check if the variable exists in the environment
  );

  // If any variables are missing, throw an error with details
  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}` // Format error message with missing variable names
    );
  }
};