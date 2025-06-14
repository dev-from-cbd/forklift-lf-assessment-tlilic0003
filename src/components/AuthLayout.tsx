// Import React hooks and components
import React, { useEffect, useState } from 'react';
// Import routing components
import { Navigate, useLocation } from 'react-router-dom';
// Import authentication context
import { useAuth } from '../contexts/AuthContext';
// Import loading spinner icon
import { Loader2 } from 'lucide-react';
// Import Supabase client
import { supabase } from '../config/supabase';

// Define props interface for AuthLayout component
interface AuthLayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
}

// AuthLayout component definition
const AuthLayout: React.FC<AuthLayoutProps> = ({ children, requireAuth = false, requireAdmin = false }) => {
  // Get current user and loading state from auth context
  const { user, loading } = useAuth();
  // Get current route location
  const location = useLocation();
  // State for admin status
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  // State for admin status checking
  const [checkingAdmin, setCheckingAdmin] = useState(requireAdmin);

  // Effect hook to check admin status when user changes
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        try {
          // Query user roles from Supabase
          const { data: roleData, error } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .single();

          if (error) {
            console.error('Error checking admin status:', error);
            setIsAdmin(false);
          } else {
            // Set admin status based on role
            setIsAdmin(roleData?.role === 'admin');
          }
        } catch (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
        } finally {
          setCheckingAdmin(false);
        }
      } else {
        // User not logged in
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
    return <Navigate to="/" replace />;
  }

  // Redirect to questions if user is logged in but tries to access auth pages
  if (user && ['/login', '/register', '/reset-password'].includes(location.pathname)) {
    return <Navigate to="/" replace />;
  }

  // Render children if all checks pass
  return <>{children}</>;
};

export default AuthLayout;