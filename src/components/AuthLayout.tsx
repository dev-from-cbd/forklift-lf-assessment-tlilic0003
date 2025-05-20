// Import necessary React hooks and components
import React, { useEffect, useState } from 'react';
// Import routing components from react-router-dom
import { Navigate, useLocation } from 'react-router-dom';
// Import custom authentication context hook
import { useAuth } from '../contexts/AuthContext';
// Import loading spinner icon from Lucide
import { Loader2 } from 'lucide-react';
// Import Supabase client configuration
import { supabase } from '../config/supabase';

// Define interface for AuthLayout component props
interface AuthLayoutProps {
  children: React.ReactNode;     // Child components to be rendered inside the layout
  requireAuth?: boolean;         // Optional flag to require authentication
  requireAdmin?: boolean;        // Optional flag to require admin privileges
}

// Define AuthLayout component with default values for optional props
const AuthLayout: React.FC<AuthLayoutProps> = ({ children, requireAuth = false, requireAdmin = false }) => {
  // Get user and loading state from auth context
  const { user, loading } = useAuth();
  // Get current location from router
  const location = useLocation();
  // State to track if user has admin role
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  // State to track if we're currently checking admin status
  const [checkingAdmin, setCheckingAdmin] = useState(requireAdmin);

  // Effect hook to check admin status when user changes
  useEffect(() => {
    // Define async function to check admin status
    const checkAdminStatus = async () => {
      // Only check admin status if user is logged in
      if (user) {
        try {
          // Query user_roles table to check if user has admin role
          const { data: roleData, error } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .single();

          // Handle error from database query
          if (error) {
            console.error('Error checking admin status:', error);
            setIsAdmin(false);
          } else {
            // Set admin status based on role value
            setIsAdmin(roleData?.role === 'admin');
          }
        } catch (error) {
          // Handle any unexpected errors
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
        } finally {
          // Set checking state to false regardless of outcome
          setCheckingAdmin(false);
        }
      } else {
        // If no user is logged in, they can't be admin
        setIsAdmin(false);
        setCheckingAdmin(false);
      }
    };

    // Call the check function
    checkAdminStatus();
  }, [user]); // Dependency array - re-run when user changes

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
    return <Navigate to="/" replace />;
  }

  // Redirect to questions if user is logged in but tries to access auth pages
  if (user && ['/login', '/register', '/reset-password'].includes(location.pathname)) {
    return <Navigate to="/" replace />;
  }

  // Render children components if all checks pass
  return <>{children}</>;
};

// Export the AuthLayout component as default
export default AuthLayout;