import React, { useEffect, useState } from 'react'; // Import React hooks for component state and lifecycle management
import { useNavigate } from 'react-router-dom'; // Import navigation hook for programmatic routing
import { supabase } from '../config/supabase'; // Import Supabase client for authentication operations
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react'; // Import icons for different UI states

const AuthCallback: React.FC = () => { // Define functional component for handling authentication callbacks
  const navigate = useNavigate(); // Initialize navigation hook for redirecting users
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading'); // State to track callback processing status
  const [message, setMessage] = useState(''); // State to store user-facing messages

  useEffect(() => { // Effect hook to handle authentication callback when component mounts
    const handleAuthCallback = async () => { // Async function to process authentication callback
      try { // Try block to handle potential errors during authentication
        const { data, error } = await supabase.auth.getSession(); // Get current session from Supabase
        
        if (error) { // Check if there was an error getting the session
          console.error('Auth callback error:', error); // Log error to console for debugging
          setStatus('error'); // Set status to error state
          setMessage('Email confirmation failed. The link may have expired or is invalid.'); // Set error message for user
          return; // Exit function early if error occurred
        }

        if (data.session) { // Check if a valid session exists (user is authenticated)
          setStatus('success'); // Set status to success state
          setMessage('Email confirmed successfully! Redirecting to your account...'); // Set success message for user
          
          // Redirect to home page after 2 seconds
          setTimeout(() => { // Set timeout for delayed navigation
            navigate('/'); // Navigate to home page
          }, 2000); // Wait 2 seconds before redirecting
        } else { // Handle case when no session exists
          // Check URL parameters for error information
          const urlParams = new URLSearchParams(window.location.search); // Parse URL search parameters
          const error_description = urlParams.get('error_description'); // Get error description from URL
          
          if (error_description) { // Check if error description exists in URL
            setStatus('error'); // Set status to error state
            if (error_description.includes('expired')) { // Check if error is due to expired link
              setMessage('Email confirmation link has expired. Please request a new confirmation email.'); // Set expired link message
            } else if (error_description.includes('invalid')) { // Check if error is due to invalid link
              setMessage('Email confirmation link is invalid. Please request a new confirmation email.'); // Set invalid link message
            } else { // Handle other types of errors
              setMessage('Email confirmation failed. Please try again or contact support.'); // Set generic error message
            }
          } else { // Handle case when no error description but no session
            setStatus('success'); // Set status to success state
            setMessage('Email confirmed successfully! You can now sign in to your account.'); // Set success message
            
            // Redirect to login page after 2 seconds
            setTimeout(() => { // Set timeout for delayed navigation
              navigate('/login'); // Navigate to login page
            }, 2000); // Wait 2 seconds before redirecting
          }
        }
      } catch (err) { // Catch any unexpected errors
        console.error('Unexpected error during auth callback:', err); // Log unexpected error to console
        setStatus('error'); // Set status to error state
        setMessage('An unexpected error occurred. Please try again.'); // Set generic error message
      }
    };

    handleAuthCallback(); // Call the authentication callback handler
  }, [navigate]); // Dependency array with navigate function

  return ( // Return JSX for the component
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8"> {/* Main container with full height, gray background, and centered content */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md"> {/* Responsive container with max width */}
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10"> {/* White card with padding, shadow, and rounded corners */}
          <div className="text-center space-y-6"> {/* Centered content with vertical spacing */}
            {status === 'loading' && ( // Conditional rendering for loading state
              <> {/* React fragment for multiple elements */}
                <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600" /> {/* Animated loading spinner icon */}
                <h2 className="text-2xl font-bold text-gray-900"> {/* Main heading for loading state */}
                  Confirming your email... {/* Loading message text */}
                </h2>
                <p className="text-gray-600"> {/* Subtext for loading state */}
                  Please wait while we verify your email address. {/* Loading description text */}
                </p>
              </>
            )}

            {status === 'success' && ( // Conditional rendering for success state
              <> {/* React fragment for multiple elements */}
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100"> {/* Green circular container for success icon */}
                  <CheckCircle className="h-6 w-6 text-green-600" /> {/* Green checkmark icon */}
                </div>
                <h2 className="text-2xl font-bold text-gray-900"> {/* Main heading for success state */}
                  Email Confirmed! {/* Success message text */}
                </h2>
                <p className="text-gray-600">{message}</p> {/* Dynamic success message from state */}
              </>
            )}

            {status === 'error' && ( // Conditional rendering for error state
              <> {/* React fragment for multiple elements */}
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100"> {/* Red circular container for error icon */}
                  <AlertCircle className="h-6 w-6 text-red-600" /> {/* Red alert icon */}
                </div>
                <h2 className="text-2xl font-bold text-gray-900"> {/* Main heading for error state */}
                  Confirmation Failed {/* Error message text */}
                </h2>
                <p className="text-gray-600">{message}</p> {/* Dynamic error message from state */}
                <div className="space-y-3"> {/* Container for action buttons with vertical spacing */}
                  <button // Primary action button for creating new account
                    onClick={() => navigate('/register')} // Click handler to navigate to registration page
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" // Full-width blue button styling with hover and focus states
                  >
                    Create New Account {/* Button text for registration */}
                  </button>
                  <button // Secondary action button for returning to login
                    onClick={() => navigate('/login')} // Click handler to navigate to login page
                    className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" // Full-width white button styling with gray border and hover states
                  >
                    Back to Sign In {/* Button text for login */}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  ); // End of JSX return
}; // End of component function

export default AuthCallback; // Export the AuthCallback component as default export