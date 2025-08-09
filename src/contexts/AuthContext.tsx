// Create a context to manage authentication state throughout the app
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../config/supabase';

// Define the shape of our auth context
interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, metadata?: any) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  updateEmail: (newEmail: string) => Promise<void>;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Get the correct site URL for redirects
const getSiteUrl = () => {
  // In production, use the deployed URL
  if (import.meta.env.PROD) {
    return 'https://forklift-lo-tlilic0004.netlify.app';
  }
  // In development, use localhost
  return window.location.origin;
};

// Provider component that wraps the app and makes auth object available
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State to hold the authenticated user and loading status
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      
      // If user signs in and is the admin email, ensure admin role
      if (session?.user && session.user.email === import.meta.env.VITE_ADMIN_EMAIL) {
        try {
          await supabase
            .from('user_roles')
            .upsert({ 
              user_id: session.user.id, 
              role: 'admin' 
            }, { 
              onConflict: 'user_id' 
            });
        } catch (error) {
          console.error('Error setting admin role:', error);
        }
      }
    });

    // Cleanup subscription
    return () => subscription.unsubscribe();
  }, []);

  // Sign up function
  const signUp = async (email: string, password: string, metadata?: any) => {
    const siteUrl = getSiteUrl();
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${siteUrl}/auth/callback`,
        data: {
          email_confirm_redirect_url: `${siteUrl}/auth/callback`,
          ...metadata
        }
      }
    });
    
    if (error) throw error;

    // If this is the admin email, ensure admin role is set
    if (email === import.meta.env.VITE_ADMIN_EMAIL && data.user) {
      try {
        await supabase
          .from('user_roles')
          .upsert({ 
            user_id: data.user.id, 
            role: 'admin' 
          }, { 
            onConflict: 'user_id' 
          });
      } catch (roleError) {
        console.error('Error setting admin role:', roleError);
      }
    }

    // Create user preferences record
    if (data.user) {
      try {
        await supabase
          .from('user_preferences')
          .insert({
            user_id: data.user.id,
            email: email,
            email_notifications: true,
            marketing_emails: true
          });
      } catch (prefError) {
        console.error('Error creating user preferences:', prefError);
      }
    }
  };

  // Sign in function
  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  // Sign out function
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  // Reset password function
  const resetPassword = async (email: string) => {
    const siteUrl = getSiteUrl();
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteUrl}/auth/reset-password-confirm`
    });
    if (error) throw error;
  };

  // Update password function
  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) throw error;
  };

  // Update email function
  const updateEmail = async (newEmail: string) => {
    const { error } = await supabase.auth.updateUser({
      email: newEmail,
    });
    if (error) throw error;
  };

  // Provide the auth context value to children
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
      {children}
    </AuthContext.Provider>
  );
};