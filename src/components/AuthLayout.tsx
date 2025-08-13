import React, { useEffect, useState } from 'react'; // Import React hooks for component state and lifecycle management
import { Navigate, useLocation } from 'react-router-dom'; // Import navigation components for routing
import { useAuth } from '../contexts/AuthContext'; // Import authentication context hook
import { Loader2 } from 'lucide-react'; // Import loading spinner icon
import { supabase } from '../config/supabase'; // Import Supabase client for database operations

interface AuthLayoutProps { // Define TypeScript interface for component props
  children: React.ReactNode; // Child components to render
  requireAuth?: boolean; // Optional flag to require authentication
  requireAdmin?: boolean; // Optional flag to require admin privileges
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, requireAuth = false, requireAdmin = false }) => { // Define functional component with props destructuring and default values
  const { user, loading } = useAuth(); // Get user data and loading state from auth context
  const location = useLocation(); // Get current location object for routing
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null); // State to track admin status (null = unknown, true/false = confirmed)
  const [checkingAdmin, setCheckingAdmin] = useState(requireAdmin); // State to track if admin check is in progress

  useEffect(() => { // Effect hook to check admin status when user changes
    const checkAdminStatus = async () => { // Async function to verify admin privileges
      if (user) { // Check if user is logged in
        try { // Try block to handle potential errors
          // Check if user is admin by email (fallback method)
          if (user.email === import.meta.env.VITE_ADMIN_EMAIL) { // Compare user email with admin email from environment variables
            setIsAdmin(true); // Set admin status to true
            setCheckingAdmin(false); // Stop checking process
            return; // Exit function early
          }

          // Check admin status in database
          const { data: roleData, error } = await supabase // Query user roles table in Supabase
            .from('user_roles') // Select from user_roles table
            .select('role') // Select only the role column
            .eq('user_id', user.id) // Filter by current user ID
            .single(); // Expect single result

          if (error && error.code !== 'PGRST116') { // Check for errors (ignore "no rows found" error)
            console.error('Error checking admin status:', error); // Log error to console
          }

          setIsAdmin(roleData?.role === 'admin' || user.email === 'neoguru@gmail.com'); // Set admin status based on role or hardcoded email
          setIsAdmin(roleData?.role === 'admin' || user.email === import.meta.env.VITE_ADMIN_EMAIL); // Override with environment variable check
        } catch (error) { // Catch any unexpected errors
          console.error('Error checking admin status:', error); // Log error to console
          // Fallback: check by email
          setIsAdmin(user.email === import.meta.env.VITE_ADMIN_EMAIL); // Fallback to email-based admin check
        } finally { // Always execute this block
          setCheckingAdmin(false); // Stop the checking process
        }
      } else { // If no user is logged in
        setIsAdmin(false); // Set admin status to false
        setCheckingAdmin(false); // Stop checking process
      }
    };

    checkAdminStatus(); // Call the admin status check function
  }, [user]); // Dependency array - re-run when user changes

  // Show loading spinner while checking auth state or admin status
  if (loading || checkingAdmin) { // Check if authentication or admin status is still loading
    return ( // Return loading UI
      <div className="min-h-screen flex items-center justify-center"> {/* Full-height container with centered content */}
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" /> {/* Animated loading spinner */}
      </div>
    );
  }

  // Redirect to login if authentication is required but user is not logged in
  if (requireAuth && !user) { // Check if auth is required but no user is logged in
    return <Navigate to="/login" state={{ from: location }} replace />; // Redirect to login page with current location state
  }

  // Only redirect if we've confirmed the user is not an admin
  if (requireAdmin && isAdmin === false) { // Check if admin is required but user is confirmed not admin
    return ( // Return access denied UI
      <div className="min-h-screen flex items-center justify-center bg-gray-50"> {/* Full-height container with gray background */}
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center"> {/* White card container with shadow */}
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2> {/* Red error heading */}
          <p className="text-gray-600 mb-4"> {/* Error description text */}
            You don't have administrator privileges to access this page. {/* Access denied message */}
          </p>
          <p className="text-sm text-gray-500 mb-6"> {/* User info text */}
            Current user: {user?.email} {/* Display current user email */}
          </p>
          <button // Home navigation button
            onClick={() => window.location.href = '/'} // Click handler to navigate to home page
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" // Blue button styling with hover effect
          >
            Go to Home {/* Button text */}
          </button>
        </div>
      </div>
    );
  }

  // Redirect to questions if user is logged in but tries to access auth pages
  if (user && ['/login', '/register', '/reset-password'].includes(location.pathname)) { // Check if logged-in user tries to access auth pages
    return <Navigate to="/" replace />; // Redirect to home page
  }

  return <>{children}</>; // Render child components if all checks pass
}; // End of component function

export default AuthLayout; // Export the AuthLayout component as default export