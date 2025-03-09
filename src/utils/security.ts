// Import initialized Supabase client from configuration file
import { supabase } from '../config/supabase';

// Function to check if user is currently authenticated
export const checkAuth = async () => {
  // Retrieve the current user's session data from Supabase
  const { data: { session } } = await supabase.auth.getSession();

  // Return session data (null if no session exists)
  return session;
};

// Function to sanitize user input to prevent security risks
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags for security
    .trim();              // Remove extra whitespace from beginning and end
};

// Function to verify required environment variables exist at runtime
export const validateEnvironmentVariables = () => {
  // List of required environment variables for the application
  const requiredVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
    'JWT_SECRET'
  ];

  // Identify which variables are missing from the current environment
  const missingVars = requiredVars.filter(
    varName => !import.meta.env[varName]
  );

  // If any required environment variables are missing, throw an error
  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`
    );
  }
};
