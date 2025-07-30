// Import React library and hooks for state management and lifecycle methods
import React, { useEffect, useState } from 'react';
// Import navigation components from React Router for programmatic navigation and location tracking
import { Navigate, useLocation } from 'react-router-dom';
// Import custom authentication context hook for user authentication state
import { useAuth } from '../contexts/AuthContext';
// Import loading spinner icon component from Lucide React icon library
import { Loader2 } from 'lucide-react';
// Import Supabase client configuration for database operations
import { supabase } from '../config/supabase';

// TypeScript interface defining the props structure for AuthLayout component
interface AuthLayoutProps {
  children: React.ReactNode;    // Child components to be rendered inside the layout
  requireAuth?: boolean;        // Optional flag to require user authentication
  requireAdmin?: boolean;       // Optional flag to require admin privileges
}

// Main AuthLayout functional component with TypeScript typing and default prop values
const AuthLayout: React.FC<AuthLayoutProps> = ({ children, requireAuth = false, requireAdmin = false }) => {
  // Destructure user object and loading state from authentication context
  const { user, loading } = useAuth();
  // Get current location object from React Router
  const location = useLocation();
  // State hook for tracking admin status (null = unknown, true = admin, false = not admin)
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  // State hook for tracking if admin status check is in progress
  const [checkingAdmin, setCheckingAdmin] = useState(requireAdmin);

  // Effect hook that runs when user changes to check admin status
  useEffect(() => {
    // Async function to check if current user has admin privileges
    const checkAdminStatus = async () => {
      // Only check admin status if user is authenticated
      if (user) {
        try {
          // First check: Compare user email with admin email from environment variables (fallback method)
          if (user.email === import.meta.env.VITE_ADMIN_EMAIL) {
            setIsAdmin(true);           // Set admin status to true
            setCheckingAdmin(false);    // Stop checking process
            return;                     // Exit function early
          }

          // Second check: Query database for user role information
          const { data: roleData, error } = await supabase
            .from('user_roles')         // Query user_roles table
            .select('role')             // Select only the role column
            .eq('user_id', user.id)     // Filter by current user's ID
            .single();                  // Expect single result

          // Handle database errors (ignore PGRST116 which means no rows found)
          if (error && error.code !== 'PGRST116') {
            console.error('Error checking admin status:', error);
          }

          // Set admin status based on database role or hardcoded admin email
          setIsAdmin(roleData?.role === 'admin' || user.email === 'neoguru@gmail.com');
          // Override with environment variable check (this line seems redundant)
          setIsAdmin(roleData?.role === 'admin' || user.email === import.meta.env.VITE_ADMIN_EMAIL);
        } catch (error) {
          console.error('Error checking admin status:', error);  // Log any unexpected errors
          // Fallback: check admin status by email comparison only
          setIsAdmin(user.email === import.meta.env.VITE_ADMIN_EMAIL);
        } finally {
          setCheckingAdmin(false);      // Always stop checking process when done
        }
      } else {
        // No user authenticated, set admin status to false
        setIsAdmin(false);
        setCheckingAdmin(false);
      }
    };

    // Call the admin status check function
    checkAdminStatus();
  }, [user]); // Dependency array - re-run effect when user changes

  // Show loading spinner while authentication state or admin status is being checked
  if (loading || checkingAdmin) {
    return (
      // Full screen container with centered content
      <div className="min-h-screen flex items-center justify-center">
        {/* Animated loading spinner with blue color */}
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Redirect to login page if authentication is required but user is not logged in
  if (requireAuth && !user) {
    // Navigate to login page and preserve the current location for redirect after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Show access denied page if admin privileges are required but user is confirmed not an admin
  if (requireAdmin && isAdmin === false) {
    return (
      // Full screen container with gray background and centered content
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        {/* Access denied card with white background and shadow */}
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          {/* Error heading in red color */}
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          {/* Main error message */}
          <p className="text-gray-600 mb-4">
            You don't have administrator privileges to access this page.
          </p>
          {/* Display current user's email for debugging */}
          <p className="text-sm text-gray-500 mb-6">
            Current user: {user?.email}
          </p>
          {/* Button to navigate back to home page */}
          <button
            onClick={() => window.location.href = '/'}  // Force page reload to home
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  // Redirect authenticated users away from auth pages (login, register, reset-password)
  if (user && ['/login', '/register', '/reset-password'].includes(location.pathname)) {
    // Navigate to home page if user is already logged in and tries to access auth pages
    return <Navigate to="/" replace />;
  }

  // Render child components if all authentication and authorization checks pass
  return <>{children}</>;
};

// Export AuthLayout component as default export
export default AuthLayout;import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { supabase } from '../config/supabase';

interface AuthLayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, requireAuth = false, requireAdmin = false }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [checkingAdmin, setCheckingAdmin] = useState(requireAdmin);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        try {
          // Check if user is admin by email (fallback method)
          if (user.email === import.meta.env.VITE_ADMIN_EMAIL) {
            setIsAdmin(true);
            setCheckingAdmin(false);
            return;
          }

          // Check admin status in database
          const { data: roleData, error } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .single();

          if (error && error.code !== 'PGRST116') {
            console.error('Error checking admin status:', error);
          }

          setIsAdmin(roleData?.role === 'admin' || user.email === 'neoguru@gmail.com');
          setIsAdmin(roleData?.role === 'admin' || user.email === import.meta.env.VITE_ADMIN_EMAIL);
        } catch (error) {
          console.error('Error checking admin status:', error);
          // Fallback: check by email
          setIsAdmin(user.email === import.meta.env.VITE_ADMIN_EMAIL);
        } finally {
          setCheckingAdmin(false);
        }
      } else {
        setIsAdmin(false);
        setCheckingAdmin(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  // Show loading spinner while checking auth state or admin status
  if (loading || checkingAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Redirect to login if authentication is required but user is not logged in
  if (requireAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Only redirect if we've confirmed the user is not an admin
  if (requireAdmin && isAdmin === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">
            You don't have administrator privileges to access this page.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Current user: {user?.email}
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  // Redirect to questions if user is logged in but tries to access auth pages
  if (user && ['/login', '/register', '/reset-password'].includes(location.pathname)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AuthLayout;