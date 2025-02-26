// Import React and specific hooks (useEffect and useState) from the React library
import React, { useEffect, useState } from "react";

// Import Navigate for redirection and useLocation for accessing current route info from react-router-dom
import { Navigate, useLocation } from "react-router-dom";

// Import custom hook useAuth from AuthContext to access authentication data
import { useAuth } from "../contexts/AuthContext";

// Import Loader2 icon from lucide-react for loading spinner
import { Loader2 } from "lucide-react";

// Import configured Supabase client instance for database operations
import { supabase } from "../config/supabase";

// Define the AuthLayoutProps interface to type-check the props passed to the component
interface AuthLayoutProps {
  children: React.ReactNode; // The content wrapped by this layout component
  requireAuth?: boolean; // Optional flag to enforce authenticated access
  requireAdmin?: boolean; // Optional flag to enforce admin-only access
}

// Define the AuthLayout component as a functional component with typed props
const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  requireAuth = false,
  requireAdmin = false,
}) => {
  // Destructure user and loading state from the useAuth hook
  const { user, loading } = useAuth();

  // Get the current location (route) using useLocation hook
  const location = useLocation();

  // State to track if the user is an admin, initialized as null (unknown)
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  // State to track if admin status is being checked, initialized based on requireAdmin prop
  const [checkingAdmin, setCheckingAdmin] = useState(requireAdmin);

  // useEffect hook to check admin status when the user changes
  useEffect(() => {
    // Define an async function to check if the user has admin role
    const checkAdminStatus = async () => {
      // Only proceed if there’s a logged-in user
      if (user) {
        try {
          // Query the 'user_roles' table in Supabase for the user’s role
          const { data: roleData, error } = await supabase
            .from("user_roles")
            .select("role") // Select only the 'role' column
            .eq("user_id", user.id) // Match the current user’s ID
            .single(); // Expect a single row result

          // If there’s an error, log it and assume non-admin status
          if (error) {
            console.error("Error checking admin status:", error);
            setIsAdmin(false);
          } else {
            // Set isAdmin to true if the role is 'admin', false otherwise
            setIsAdmin(roleData?.role === "admin");
          }
        } catch (error) {
          // Catch any unexpected errors, log them, and assume non-admin status
          console.error("Error checking admin status:", error);
          setIsAdmin(false);
        } finally {
          // Set checkingAdmin to false once the check is complete
          setCheckingAdmin(false);
        }
      } else {
        // If no user is logged in, set isAdmin to false and stop checking
        setIsAdmin(false);
        setCheckingAdmin(false);
      }
    };

    // Call the admin status check function when the effect runs
    checkAdminStatus();
  }, [user]); // Dependency array includes 'user' to re-run when user changes

  // Render a loading spinner while auth state or admin status is being checked
  if (loading || checkingAdmin) {
    return (
      // Full-screen centered div to display the loading spinner
      <div className="min-h-screen flex items-center justify-center">
        // Animated Loader2 icon indicating something is being processed
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Redirect to login page if authentication is required but no user is logged in
  if (requireAuth && !user) {
    // Pass the current location in state so user can be redirected back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect to homepage if admin access is required and user is confirmed not an admin
  if (requireAdmin && isAdmin === false) {
    return <Navigate to="/" replace />;
  }

  // Redirect logged-in users away from auth-related pages (login, register, reset-password)
  if (
    user &&
    ["/login", "/register", "/reset-password"].includes(location.pathname)
  ) {
    return <Navigate to="/" replace />;
  }

  // If all checks pass, render the children (wrapped content)
  return <>{children}</>;
};

// Export the AuthLayout component as the default export
export default AuthLayout;
