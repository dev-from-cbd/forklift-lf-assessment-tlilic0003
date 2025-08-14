import React, { useEffect, useState } from 'react'; // Import React hooks for component state and lifecycle management
import { supabase } from '../config/supabase'; // Import Supabase client configuration
import { CheckCircle, XCircle, AlertCircle, Database, Loader2 } from 'lucide-react'; // Import icons for UI status indicators

const ConnectionCheck: React.FC = () => { // Define functional component for checking Supabase connection status
  const [status, setStatus] = useState<{ // State to track connection status and related information
    connection: 'checking' | 'connected' | 'error'; // Connection state: checking, connected, or error
    details: string; // Detailed status message
    envVars: { // Environment variables status
      hasUrl: boolean; // Whether VITE_SUPABASE_URL is configured
      hasKey: boolean; // Whether VITE_SUPABASE_ANON_KEY is configured
      url?: string; // The actual Supabase URL value
    };
    user: any; // Current authenticated user data
  }>({
    connection: 'checking', // Initial state: checking connection
    details: '', // Initial details: empty string
    envVars: { hasUrl: false, hasKey: false }, // Initial env vars: not configured
    user: null // Initial user: not authenticated
  });

  useEffect(() => { // Effect hook to run connection check on component mount
    checkConnection(); // Call connection check function
  }, []); // Empty dependency array means this runs only once on mount

  const checkConnection = async () => { // Async function to check Supabase connection and configuration
    try { // Try block to handle potential errors
      // Check environment variables
      const hasUrl = !!import.meta.env.VITE_SUPABASE_URL; // Check if Supabase URL environment variable exists
      const hasKey = !!import.meta.env.VITE_SUPABASE_ANON_KEY; // Check if Supabase anonymous key environment variable exists
      const url = import.meta.env.VITE_SUPABASE_URL; // Get the actual Supabase URL value

      if (!hasUrl || !hasKey) { // If either environment variable is missing
        setStatus({ // Update status to error state
          connection: 'error', // Set connection status to error
          details: 'Missing Supabase environment variables', // Provide error details
          envVars: { hasUrl, hasKey, url }, // Include environment variable status
          user: null // No user data available
        });
        return; // Exit function early if environment variables are missing
      }

      // Test database connection
      const { data: testData, error: testError } = await supabase // Attempt to query the database
        .from('user_roles') // Query the user_roles table
        .select('count', { count: 'exact', head: true }); // Select count with exact count and head-only request

      if (testError) { // If database query failed
        setStatus({ // Update status to error state
          connection: 'error', // Set connection status to error
          details: `Database error: ${testError.message}`, // Include specific database error message
          envVars: { hasUrl, hasKey, url }, // Include environment variable status
          user: null // No user data available
        });
        return; // Exit function early if database connection failed
      }

      // Check current user
      const { data: { user }, error: userError } = await supabase.auth.getUser(); // Get current authenticated user

      setStatus({ // Update status to successful connection state
        connection: 'connected', // Set connection status to connected
        details: 'All systems operational', // Provide success message
        envVars: { hasUrl, hasKey, url }, // Include environment variable status
        user: user // Include authenticated user data
      });

    } catch (error) { // Catch any unexpected errors during connection check
      setStatus({ // Update status to error state
        connection: 'error', // Set connection status to error
        details: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`, // Include error message or fallback
        envVars: { hasUrl: false, hasKey: false }, // Reset environment variables status
        user: null // No user data available
      });
    }
  }; // End of checkConnection function

  const StatusIcon = () => { // Component function to render appropriate status icon
    switch (status.connection) { // Switch based on current connection status
      case 'connected': // If connection is successful
        return <CheckCircle className="w-6 h-6 text-green-500" />; // Return green check circle icon
      case 'error': // If connection has error
        return <XCircle className="w-6 h-6 text-red-500" />; // Return red X circle icon
      default: // For 'checking' status or any other case
        return <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />; // Return spinning loader icon
    }
  }; // End of StatusIcon function

  return ( // JSX return statement for the component
    <div className="max-w-2xl mx-auto p-6"> {/* Main container with max width, centered, and padding */}
      <div className="bg-white rounded-lg shadow-lg p-6"> {/* White card container with rounded corners, shadow, and padding */}
        <div className="flex items-center mb-6"> {/* Header section with flex layout and bottom margin */}
          <Database className="w-8 h-8 text-blue-600 mr-3" /> {/* Database icon with blue color and right margin */}
          <h2 className="text-2xl font-bold">Supabase Connection Status</h2> {/* Main title with large font and bold weight */}
        </div> {/* End of header section */}

        {/* Main Status */}
        <div className="flex items-center mb-6 p-4 rounded-lg bg-gray-50"> {/* Status container with flex layout, margin, padding, rounded corners, and gray background */}
          <StatusIcon /> {/* Render the appropriate status icon based on connection state */}
          <div className="ml-3"> {/* Text container with left margin */}
            <h3 className="text-lg font-semibold capitalize">{status.connection}</h3> {/* Connection status text with large font, semibold weight, and capitalized */}
            <p className="text-gray-600">{status.details}</p> {/* Status details text with gray color */}
          </div> {/* End of text container */}
        </div> {/* End of status container */}

        {/* Environment Variables */}
        <div className="mb-6"> {/* Environment variables section with bottom margin */}
          <h4 className="text-lg font-semibold mb-3">Environment Configuration</h4> {/* Section title with large font, semibold weight, and bottom margin */}
          <div className="space-y-2"> {/* Container for environment variable items with vertical spacing */}
            <div className="flex items-center"> {/* Container for VITE_SUPABASE_URL with flex layout */}
              {status.envVars.hasUrl ? ( // Conditional rendering based on URL configuration status
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" /> // Green check icon if URL is configured
              ) : (
                <XCircle className="w-5 h-5 text-red-500 mr-2" /> // Red X icon if URL is missing
              )}
              <span className="font-medium">VITE_SUPABASE_URL:</span> {/* Environment variable label with medium font weight */}
              <span className="ml-2 text-sm font-mono bg-gray-100 px-2 py-1 rounded"> {/* Status badge with left margin, small font, monospace, gray background, padding, and rounded corners */}
                {status.envVars.hasUrl ? 'Configured' : 'Missing'} {/* Display 'Configured' or 'Missing' based on status */}
              </span> {/* End of status badge */}
            </div> {/* End of VITE_SUPABASE_URL container */}
            <div className="flex items-center"> {/* Container for VITE_SUPABASE_ANON_KEY with flex layout */}
              {status.envVars.hasKey ? ( // Conditional rendering based on key configuration status
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" /> // Green check icon if key is configured
              ) : (
                <XCircle className="w-5 h-5 text-red-500 mr-2" /> // Red X icon if key is missing
              )}
              <span className="font-medium">VITE_SUPABASE_ANON_KEY:</span> {/* Environment variable label with medium font weight */}
              <span className="ml-2 text-sm font-mono bg-gray-100 px-2 py-1 rounded"> {/* Status badge with left margin, small font, monospace, gray background, padding, and rounded corners */}
                {status.envVars.hasKey ? 'Configured' : 'Missing'} {/* Display 'Configured' or 'Missing' based on status */}
              </span> {/* End of status badge */}
            </div> {/* End of VITE_SUPABASE_ANON_KEY container */}
            {status.envVars.url && ( // Conditional rendering if URL exists
              <div className="mt-2 p-3 bg-blue-50 rounded"> {/* URL display container with top margin, padding, blue background, and rounded corners */}
                <span className="text-sm font-medium">Supabase URL:</span> {/* URL label with small font and medium weight */}
                <div className="text-sm font-mono text-blue-800 break-all"> {/* URL value container with small font, monospace, blue text, and word break */}
                  {status.envVars.url} {/* Display the actual Supabase URL */}
                </div> {/* End of URL value container */}
              </div> {/* End of URL display container */}
            )}
            </div> {/* End of environment variable items container */}
          </div> {/* End of environment variables section */}

        {/* Current User */}
        {status.user && (
          <div className="mb-6"> {/* Current user section with bottom margin */}
            <h4 className="text-lg font-semibold mb-3">Current User</h4> {/* Section title with large font, semibold weight, and bottom margin */}
            <div className="bg-green-50 p-4 rounded-lg"> {/* User info container with green background, padding, and rounded corners */}
              <div className="space-y-1"> {/* Container for user details with vertical spacing */}
                <p><span className="font-medium">Email:</span> {status.user.email}</p> {/* User email with medium font weight label */}
                <p><span className="font-medium">User ID:</span> {status.user.id}</p> {/* User ID with medium font weight label */}
                <p><span className="font-medium">Created:</span> {new Date(status.user.created_at).toLocaleString()}</p> {/* User creation date formatted to locale string */}
                <p><span className="font-medium">Last Sign In:</span> {status.user.last_sign_in_at ? new Date(status.user.last_sign_in_at).toLocaleString() : 'Never'}</p> {/* Last sign in date or 'Never' if null */}
              </div> {/* End of user details container */}
            </div> {/* End of user info container */}
          </div> {/* End of current user section */}
        )}

        {/* Actions */}
        <div className="flex space-x-4"> {/* Actions container with flex layout and horizontal spacing */}
          <button // Recheck connection button
            onClick={checkConnection} // Click handler to trigger connection check
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center" // Button styling with blue background, white text, padding, rounded corners, hover effect, and flex layout
          >
            <Loader2 className="w-4 h-4 mr-2" /> {/* Loader icon with size and right margin */}
            Recheck Connection {/* Button text */}
          </button> {/* End of recheck connection button */}
          <button // Admin panel navigation button
            onClick={() => window.location.href = '/admin'} // Click handler to navigate to admin panel
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700" // Button styling with purple background, white text, padding, rounded corners, and hover effect
          >
            Go to Admin Panel {/* Button text */}
          </button> {/* End of admin panel button */}
        </div> {/* End of actions container */}

        {/* Bolt Message Explanation */}
        <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400"> {/* Information box with top margin, padding, yellow background, and left border */}
          <div className="flex"> {/* Flex container for icon and content */}
            <AlertCircle className="w-5 h-5 text-yellow-400 mr-2 flex-shrink-0 mt-0.5" /> {/* Alert icon with yellow color, right margin, no shrinking, and top margin */}
            <div> {/* Content container */}
              <h5 className="font-medium text-yellow-800">About the Bolt Supabase Message</h5> {/* Information title with medium font weight and dark yellow text */}
              <p className="text-sm text-yellow-700 mt-1"> {/* Information paragraph with small font, yellow text, and top margin */}
                The "Need a new Supabase connection?" message is a standard Bolt notification that appears {/* Explanation text about Bolt notification */}
                when working with Supabase projects. It's not an error - just Bolt being helpful! {/* Continuation of explanation */}
                You can safely ignore it if your connection is working (which it appears to be). {/* Final part of explanation */}
              </p> {/* End of information paragraph */}
            </div> {/* End of content container */}
          </div> {/* End of flex container */}
        </div> {/* End of information box */}
      </div> {/* End of white card container */}
    </div> {/* End of main container */}
  ); // End of JSX return
}; // End of ConnectionCheck component

export default ConnectionCheck; // Export the ConnectionCheck component as default export