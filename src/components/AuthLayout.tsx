import React from 'react';
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
  const [isAdmin, setIsAdmin] = React.useState<boolean | null>(null);
  const [checkingAdmin, setCheckingAdmin] = React.useState(requireAdmin);

  React.useEffect(() => {
    const checkAdminStatus = async () => {
      if (requireAdmin && user) {
        try {
          const { data: roleData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .single();

          setIsAdmin(roleData?.role === 'admin');
        } catch (error) {
          setIsAdmin(false);
        }
        setCheckingAdmin(false);
      }
    };

    checkAdminStatus();
  }, [user, requireAdmin]);

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

  // Redirect to home if admin access is required but user is not an admin
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Redirect to questions if user is logged in but tries to access auth pages
  if (user && ['/login', '/register', '/reset-password'].includes(location.pathname)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AuthLayout;