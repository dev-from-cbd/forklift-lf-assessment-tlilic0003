// Import React library and hooks for state management and lifecycle methods
import React, { useEffect, useState } from 'react';
// Import useNavigate hook from React Router for programmatic navigation
import { useNavigate } from 'react-router-dom';
// Import Supabase client configuration for authentication operations
import { supabase } from '../config/supabase';
// Import icon components from Lucide React icon library
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

// Define AuthCallback functional component with TypeScript typing
const AuthCallback: React.FC = () => {
  // Initialize navigate function for programmatic routing
  const navigate = useNavigate();
  // State hook for tracking authentication callback status (loading, success, or error)
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  // State hook for storing status message to display to user
  const [message, setMessage] = useState('');

  // Effect hook that runs once when component mounts to handle authentication callback
  useEffect(() => {
    // Async function to handle the authentication callback process
    const handleAuthCallback = async () => {
      try {
        // Attempt to get current session from Supabase authentication
        const { data, error } = await supabase.auth.getSession();
        
        // Check if there was an error getting the session
        if (error) {
          console.error('Auth callback error:', error); // Log error to console for debugging
          setStatus('error'); // Set status to error state
          setMessage('Email confirmation failed. The link may have expired or is invalid.'); // Set error message
          return; // Exit function early
        }

        // Check if a valid session exists (user is authenticated)
        if (data.session) {
          setStatus('success'); // Set status to success state
          setMessage('Email confirmed successfully! Redirecting to your account...'); // Set success message
          
          // Redirect to home page after 2 seconds delay
          setTimeout(() => {
            navigate('/'); // Navigate to home page
          }, 2000);
        } else {
          // No session found, check URL parameters for error information
          const urlParams = new URLSearchParams(window.location.search); // Parse URL search parameters
          const error_description = urlParams.get('error_description'); // Get error description from URL
          
          // Check if there's an error description in the URL
          if (error_description) {
            setStatus('error'); // Set status to error state
            // Check specific error types and set appropriate messages
            if (error_description.includes('expired')) {
              setMessage('Email confirmation link has expired. Please request a new confirmation email.');
            } else if (error_description.includes('invalid')) {
              setMessage('Email confirmation link is invalid. Please request a new confirmation email.');
            } else {
              setMessage('Email confirmation failed. Please try again or contact support.');
            }
          } else {
            // No error in URL, assume successful confirmation but no active session
            setStatus('success'); // Set status to success state
            setMessage('Email confirmed successfully! You can now sign in to your account.'); // Set success message
            
            // Redirect to login page after 2 seconds delay
            setTimeout(() => {
              navigate('/login'); // Navigate to login page
            }, 2000);
          }
        }
      } catch (err) {
        // Catch any unexpected errors during the callback process
        console.error('Unexpected error during auth callback:', err); // Log error to console
        setStatus('error'); // Set status to error state
        setMessage('An unexpected error occurred. Please try again.'); // Set generic error message
      }
    };

    // Call the authentication callback handler function
    handleAuthCallback();
  }, [navigate]); // Dependency array - re-run effect if navigate function changes

  // Render the component UI
  return (
    // Main container with full screen height and centered content
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Responsive container for the content */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* White card container with shadow and rounded corners */}
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Centered content area with vertical spacing */}
          <div className="text-center space-y-6">
            {/* Conditional rendering for loading state */}
            {status === 'loading' && (
              <>
                {/* Animated loading spinner icon */}
                <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600" />
                {/* Loading state heading */}
                <h2 className="text-2xl font-bold text-gray-900">
                  Confirming your email...
                </h2>
                {/* Loading state description */}
                <p className="text-gray-600">
                  Please wait while we verify your email address.
                </p>
              </>
            )}

            {/* Conditional rendering for success state */}
            {status === 'success' && (
              <>
                {/* Success icon container with green background */}
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                {/* Success state heading */}
                <h2 className="text-2xl font-bold text-gray-900">
                  Email Confirmed!
                </h2>
                {/* Dynamic success message */}
                <p className="text-gray-600">{message}</p>
              </>
            )}

            {/* Conditional rendering for error state */}
            {status === 'error' && (
              <>
                {/* Error icon container with red background */}
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                {/* Error state heading */}
                <h2 className="text-2xl font-bold text-gray-900">
                  Confirmation Failed
                </h2>
                {/* Dynamic error message */}
                <p className="text-gray-600">{message}</p>
                {/* Action buttons container */}
                <div className="space-y-3">
                  {/* Primary button to create new account */}
                  <button
                    onClick={() => navigate('/register')} // Navigate to registration page on click
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Create New Account
                  </button>
                  {/* Secondary button to go back to sign in */}
                  <button
                    onClick={() => navigate('/login')} // Navigate to login page on click
                    className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Back to Sign In
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Export AuthCallback component as default export
export default AuthCallback;import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          setStatus('error');
          setMessage('Email confirmation failed. The link may have expired or is invalid.');
          return;
        }

        if (data.session) {
          setStatus('success');
          setMessage('Email confirmed successfully! Redirecting to your account...');
          
          // Redirect to home page after 2 seconds
          setTimeout(() => {
            navigate('/');
          }, 2000);
        } else {
          // Check URL parameters for error information
          const urlParams = new URLSearchParams(window.location.search);
          const error_description = urlParams.get('error_description');
          
          if (error_description) {
            setStatus('error');
            if (error_description.includes('expired')) {
              setMessage('Email confirmation link has expired. Please request a new confirmation email.');
            } else if (error_description.includes('invalid')) {
              setMessage('Email confirmation link is invalid. Please request a new confirmation email.');
            } else {
              setMessage('Email confirmation failed. Please try again or contact support.');
            }
          } else {
            setStatus('success');
            setMessage('Email confirmed successfully! You can now sign in to your account.');
            
            // Redirect to login page after 2 seconds
            setTimeout(() => {
              navigate('/login');
            }, 2000);
          }
        }
      } catch (err) {
        console.error('Unexpected error during auth callback:', err);
        setStatus('error');
        setMessage('An unexpected error occurred. Please try again.');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center space-y-6">
            {status === 'loading' && (
              <>
                <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">
                  Confirming your email...
                </h2>
                <p className="text-gray-600">
                  Please wait while we verify your email address.
                </p>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Email Confirmed!
                </h2>
                <p className="text-gray-600">{message}</p>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Confirmation Failed
                </h2>
                <p className="text-gray-600">{message}</p>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/register')}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Create New Account
                  </button>
                  <button
                    onClick={() => navigate('/login')}
                    className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Back to Sign In
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;