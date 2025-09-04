// Create a context to manage authentication state throughout the app
// Import React and necessary hooks for context creation and state management
import React, { createContext, useContext, useEffect, useState } from 'react';
// Import User type from Supabase for type safety
import { User } from '@supabase/supabase-js';
// Import the Supabase client instance for authentication operations
import { supabase } from '../config/supabase';

// Define the shape of our auth context with TypeScript interface
interface AuthContextType {
  // Current authenticated user or null if not authenticated
  user: User | null;
  // Loading state to track authentication status initialization
  loading: boolean;
  // Function to register a new user with email and password
  signUp: (email: string, password: string) => Promise<void>;
  // Overloaded signUp function that can accept additional metadata
  signUp: (email: string, password: string, metadata?: any) => Promise<void>;
  // Function to authenticate an existing user with email and password
  signIn: (email: string, password: string) => Promise<void>;
  // Function to log out the current user
  signOut: () => Promise<void>;
  // Function to initiate password reset process
  resetPassword: (email: string) => Promise<void>;
  // Function to update the current user's password
  updatePassword: (newPassword: string) => Promise<void>;
  // Function to update the current user's email address
  updateEmail: (newEmail: string) => Promise<void>;
}

// Create the context with a default value of undefined
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the auth context throughout the application
export const useAuth = () => {
  // Get the context value
  const context = useContext(AuthContext);
  // Throw an error if the hook is used outside of the AuthProvider
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  // Return the context value if it exists
  return context;
};

// Helper function to get the correct site URL for redirects based on environment
const getSiteUrl = () => {
  // In production, use the deployed URL
  if (import.meta.env.PROD) {
    return 'https://forklift-lo-tlilic0004.netlify.app';
  }
  // In development, use the current origin (localhost with port)
  return window.location.origin;
};

// Provider component that wraps the app and makes auth object available to all children
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State to hold the authenticated user (null if not authenticated)
  const [user, setUser] = useState<User | null>(null);
  // State to track if authentication is still being initialized
  const [loading, setLoading] = useState(true);

  // Effect to initialize auth state and set up listeners
  useEffect(() => {
    // Get initial session when component mounts
    supabase.auth.getSession().then(({ data: { session } }) => {
      // Set user state from session (null if no session)
      setUser(session?.user ?? null);
      // Set loading to false as initialization is complete
      setLoading(false);
    });

    // Set up listener for authentication state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      // Update user state when auth state changes
      setUser(session?.user ?? null);
      
      // If user signs in and matches the admin email, ensure admin role is set
      if (session?.user && session.user.email === import.meta.env.VITE_ADMIN_EMAIL) {
        try {
          // Upsert to user_roles table to set admin role
          await supabase
            .from('user_roles')
            .upsert({ 
              user_id: session.user.id, // User ID from session
              role: 'admin' // Set role to admin
            }, { 
              onConflict: 'user_id' // Update if user_id already exists
            });
        } catch (error) {
          // Log error if admin role setting fails
          console.error('Error setting admin role:', error);
        }
      }
    });

    // Cleanup function to unsubscribe from auth changes when component unmounts
    return () => subscription.unsubscribe();
  }, []); // Empty dependency array means this effect runs once on mount

  // Function to register a new user with email, password and optional metadata
  const signUp = async (email: string, password: string, metadata?: any) => {
    // Get the appropriate site URL for redirects
    const siteUrl = getSiteUrl();
    
    // Call Supabase signUp method with email, password and redirect options
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // URL to redirect to after email confirmation
        emailRedirectTo: `${siteUrl}/auth/callback`,
        // Additional data to include with the user
        data: {
          email_confirm_redirect_url: `${siteUrl}/auth/callback`,
          ...metadata // Spread any additional metadata
        }
      }
    });
    
    // Throw any errors that occur during signup
    if (error) throw error;

    // If this is the admin email and user was created, set admin role
    if (email === import.meta.env.VITE_ADMIN_EMAIL && data.user) {
      try {
        // Upsert to user_roles table to set admin role
        await supabase
          .from('user_roles')
          .upsert({ 
            user_id: data.user.id, // User ID from created user
            role: 'admin' // Set role to admin
          }, { 
            onConflict: 'user_id' // Update if user_id already exists
          });
      } catch (roleError) {
        // Log error if admin role setting fails
        console.error('Error setting admin role:', roleError);
      }
    }

    // Create default user preferences record for the new user
    if (data.user) {
      try {
        // Insert into user_preferences table
        await supabase
          .from('user_preferences')
          .insert({
            user_id: data.user.id, // User ID from created user
            email: email, // User's email address
            email_notifications: true, // Default to enabled
            marketing_emails: true // Default to enabled
          });
      } catch (prefError) {
        // Log error if preferences creation fails
        console.error('Error creating user preferences:', prefError);
      }
    }
  };

  // Function to authenticate an existing user with email and password
  const signIn = async (email: string, password: string) => {
    // Call Supabase signInWithPassword method
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    // Throw any errors that occur during sign in
    if (error) throw error;
  };

  // Function to log out the current user
  const signOut = async () => {
    // Call Supabase signOut method
    const { error } = await supabase.auth.signOut();
    // Throw any errors that occur during sign out
    if (error) throw error;
  };

  // Function to initiate password reset process for a user
  const resetPassword = async (email: string) => {
    // Get the appropriate site URL for redirects
    const siteUrl = getSiteUrl();
    
    // Call Supabase resetPasswordForEmail method
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      // URL to redirect to after password reset
      redirectTo: `${siteUrl}/auth/reset-password-confirm`
    });
    // Throw any errors that occur during password reset
    if (error) throw error;
  };

  // Function to update the current user's password
  const updatePassword = async (newPassword: string) => {
    // Call Supabase updateUser method to change password
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    // Throw any errors that occur during password update
    if (error) throw error;
  };

  // Function to update the current user's email address
  const updateEmail = async (newEmail: string) => {
    // Call Supabase updateUser method to change email
    const { error } = await supabase.auth.updateUser({
      email: newEmail,
    });
    // Throw any errors that occur during email update
    if (error) throw error;
  };

  // Provide the auth context value to all children components
  return (
    <AuthContext.Provider value={{
      user, // Current authenticated user
      loading, // Loading state
      signUp, // Sign up function
      signIn, // Sign in function
      signOut, // Sign out function
      resetPassword, // Reset password function
      updatePassword, // Update password function
      updateEmail, // Update email function
    }}>
      {children} {/* Render children components */}
    </AuthContext.Provider>
  );
};