// Import necessary React hooks and types
import React, { createContext, useContext, useEffect, useState } from 'react';
// Import User type from Supabase
import { User } from '@supabase/supabase-js';
// Import Supabase client instance
import { supabase } from '../config/supabase';

// Define the interface for our auth context
// This describes all the properties and methods available through the context
interface AuthContextType {
  user: User | null; // Current authenticated user or null
  loading: boolean; // Loading state for auth operations
  signUp: (email: string, password: string) => Promise<void>; // Sign up method
  signIn: (email: string, password: string) => Promise<void>; // Sign in method
  signOut: () => Promise<void>; // Sign out method
  resetPassword: (email: string) => Promise<void>; // Password reset method
  updatePassword: (newPassword: string) => Promise<void>; // Update password method
  updateEmail: (newEmail: string) => Promise<void>; // Update email method
}

// Create the auth context with an initial undefined value
// This will be populated by the AuthProvider
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to access the auth context
// Throws an error if used outside of an AuthProvider
export const useAuth = () => {
  const context = useContext(AuthContext); // Get context value
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context; // Return the context value
};

// AuthProvider component that wraps the application
// Makes auth functionality available to all child components
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State to store the current authenticated user
  const [user, setUser] = useState<User | null>(null);
  // State to track loading status
  const [loading, setLoading] = useState(true);

  // Effect hook to initialize auth state and listen for changes
  useEffect(() => {
    // Get the current session when component mounts
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null); // Set user from session
      setLoading(false); // Mark loading as complete
    });

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null); // Update user when auth state changes
    });

    // Cleanup function to unsubscribe when component unmounts
    return () => subscription.unsubscribe();
  }, []); // Empty dependency array means this runs only once on mount

  // Function to handle user sign up
  const signUp = async (email: string, password: string) => {
    // Call Supabase sign up method
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: undefined // Disable email confirmation for simplicity
      }
    });
    
    if (error) throw error; // Throw any errors

    // Special handling for admin user
    if (email === 'neoguru@gmail.com' && data.user) {
      try {
        // Set admin role in database
        await supabase
          .from('user_roles')
          .upsert({ 
            user_id: data.user.id, 
            role: 'admin' 
          }, { 
            onConflict: 'user_id' // Update if user_id already exists
          });
      } catch (roleError) {
        console.error('Error setting admin role:', roleError);
      }
    }
  };

  // Function to handle user sign in
  const signIn = async (email: string, password: string) => {
    // Call Supabase sign in method
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error; // Throw any errors
  };

  // Function to handle user sign out
  const signOut = async () => {
    // Call Supabase sign out method
    const { error } = await supabase.auth.signOut();
    if (error) throw error; // Throw any errors
  };

  // Function to handle password reset
  const resetPassword = async (email: string) => {
    // Call Supabase password reset method
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password-confirm` // Redirect URL
    });
    if (error) throw error; // Throw any errors
  };

  // Function to update user password
  const updatePassword = async (newPassword: string) => {
    // Call Supabase update user method
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) throw error; // Throw any errors
  };

  // Function to update user email
  const updateEmail = async (newEmail: string) => {
    // Call Supabase update user method
    const { error } = await supabase.auth.updateUser({
      email: newEmail,
    });
    if (error) throw error; // Throw any errors
  };

  // Render the provider with all auth methods and state
  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signUp,
      signIn,
      signOut,
      resetPassword,
      updatePassword,
      updateEmail,
    }}>
      {children} {/* Render child components */}
    </AuthContext.Provider>
  );
};