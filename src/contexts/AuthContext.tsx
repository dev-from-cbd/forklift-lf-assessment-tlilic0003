// Create a context to manage authentication state throughout the app
// Import necessary React hooks and types, User type from Supabase, and the Supabase client instance.
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js'; // Type definition for a Supabase user.
import { supabase } from '../config/supabase'; // Supabase client initialized in a separate config file.

// Define the shape (interface) of our authentication context.
// This specifies what values and functions will be available via this context.
interface AuthContextType {
  user: User | null; // The current authenticated user object, or null if not authenticated.
  loading: boolean; // A boolean flag to indicate if authentication status is currently being loaded.
  signUp: (email: string, password: string) => Promise<void>; // Function to handle user registration.
  signIn: (email: string, password: string) => Promise<void>; // Function to handle user login.
  signOut: () => Promise<void>; // Function to handle user logout.
  resetPassword: (email: string) => Promise<void>; // Function to handle password reset requests.
  updatePassword: (newPassword: string) => Promise<void>; // Function to update the current user's password.
  updateEmail: (newEmail: string) => Promise<void>; // Function to update the current user's email.
}

// Create the actual React Context with a default value of 'undefined'.
// Consumers will need to check if the context is defined before using it.
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook 'useAuth' to easily consume the AuthContext in functional components.
export const useAuth = () => {
  // Get the current context value.
  const context = useContext(AuthContext);
  // If the context is undefined, it means 'useAuth' is used outside of an 'AuthProvider'.
  // Throw an error to alert the developer.
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  // Return the context, providing access to user, loading state, and auth functions.
  return context;
};

// AuthProvider component: wraps parts of the app that need access to authentication state.
// It takes 'children' as a prop, which are the components it will wrap.
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State to hold the authenticated user object (or null) and the loading status.
  const [user, setUser] = useState<User | null>(null); // Initialize user as null.
  const [loading, setLoading] = useState(true); // Initialize loading as true, as we'll fetch session initially.

  // useEffect hook to run side effects (like fetching data or subscriptions) after component renders.
  useEffect(() => {
    // Attempt to get the initial user session from Supabase when the component mounts.
    supabase.auth.getSession().then(({ data: { session } }) => {
      // Set the user state based on the session's user, or null if no session.
      setUser(session?.user ?? null);
      // Set loading to false once the initial session check is complete.
      setLoading(false);
    });

    // Listen for changes in Supabase's authentication state (e.g., login, logout).
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      // When auth state changes, update the user state accordingly.
      setUser(session?.user ?? null);
    });

    // Cleanup function for useEffect: Unsubscribe from the auth state changes when the component unmounts.
    // This prevents memory leaks.
    return () => subscription.unsubscribe();
  }, []); // The empty dependency array [] means this effect runs once on mount and cleans up on unmount.

  // Asynchronous function to handle user sign-up.
  const signUp = async (email: string, password: string) => {
    // Call Supabase's signUp method with the provided email and password.
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    // If there's an error during sign-up, throw it to be caught by the caller.
    if (error) throw error;
  };

  // Asynchronous function to handle user sign-in.
  const signIn = async (email: string, password: string) => {
    // Call Supabase's signInWithPassword method.
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    // If there's an error during sign-in, throw it.
    if (error) throw error;
  };

  // Asynchronous function to handle user sign-out.
  const signOut = async () => {
    // Call Supabase's signOut method.
    const { error } = await supabase.auth.signOut();
    // If there's an error during sign-out, throw it.
    if (error) throw error;
  };

  // Asynchronous function to handle password reset requests.
  const resetPassword = async (email: string) => {
    // Call Supabase's resetPasswordForEmail method.
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    // If there's an error, throw it.
    if (error) throw error;
  };

  // Asynchronous function to update the current user's password.
  const updatePassword = async (newPassword: string) => {
    // Call Supabase's updateUser method with the new password.
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    // If there's an error, throw it.
    if (error) throw error;
  };

  // Asynchronous function to update the current user's email.
  const updateEmail = async (newEmail: string) => {
    // Call Supabase's updateUser method with the new email.
    const { error } = await supabase.auth.updateUser({
      email: newEmail,
    });
    // If there's an error, throw it.
    if (error) throw error;
  };

  // Provide the authentication context value (user, loading state, and auth functions) to its children.
  return (
    <AuthContext.Provider value={{
      user,          // Current user object or null.
      loading,       // Loading state boolean.
      signUp,        // Sign-up function.
      signIn,        // Sign-in function.
      signOut,       // Sign-out function.
      resetPassword, // Password reset function.
      updatePassword,// Password update function.
      updateEmail,   // Email update function.
    }}>
      {children} {/* Render the child components wrapped by this provider. */}
    </AuthContext.Provider>
  );
};