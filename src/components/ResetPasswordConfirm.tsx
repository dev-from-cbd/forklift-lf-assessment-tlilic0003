// Import React hooks for state management and lifecycle
import React, { useState, useEffect } from 'react';
// Import navigation hook from React Router
import { useNavigate } from 'react-router-dom';
// Import Supabase client configuration
import { supabase } from '../config/supabase';
// Import authentication context hook
import { useAuth } from '../contexts/AuthContext';
// Import icons from Lucide React library
import { Loader2, KeyRound, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';

// Functional component for password reset confirmation
const ResetPasswordConfirm: React.FC = () => {
  // State for new password input
  const [newPassword, setNewPassword] = useState('');
  // State for password confirmation input
  const [confirmPassword, setConfirmPassword] = useState('');
  // State for success messages
  const [message, setMessage] = useState('');
  // State for error messages
  const [error, setError] = useState('');
  // State for loading indicator
  const [loading, setLoading] = useState(false);
  // State for success completion status
  const [isSuccess, setIsSuccess] = useState(false);
  // State for new password visibility toggle
  const [showNewPassword, setShowNewPassword] = useState(false);
  // State for confirm password visibility toggle
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // State to track if session verification is complete
  const [sessionChecked, setSessionChecked] = useState(false);
  // Extract updatePassword function from auth context
  const { updatePassword } = useAuth();
  // Navigation hook for programmatic routing
  const navigate = useNavigate();

  // Effect hook to verify password reset session on component mount
  useEffect(() => {
    // Async function to check and validate the reset session
    const checkSession = async () => {
      try {
        // Check URL hash for tokens (Supabase auth callback)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        // Extract access token from URL hash parameters
        const accessToken = hashParams.get('access_token');
        // Extract refresh token from URL hash parameters
        const refreshToken = hashParams.get('refresh_token');
        // Extract type parameter to verify it's a recovery request
        const type = hashParams.get('type');
        
        // Check URL search params for errors
        const urlParams = new URLSearchParams(window.location.search);
        // Extract error description from URL parameters
        const error_description = urlParams.get('error_description');
        
        // Check if there's an error description in URL parameters
        if (error_description) {
          // Handle expired reset link error
          if (error_description.includes('expired')) {
            setError('Password reset link has expired. Please request a new password reset.');
          // Handle invalid reset link error
          } else if (error_description.includes('invalid')) {
            setError('Password reset link is invalid. Please request a new password reset.');
          // Handle other reset errors
          } else {
            setError('Password reset failed. Please try again.');
          }
        // Check if we have valid tokens for password recovery
        } else if (accessToken && type === 'recovery') {
          // Set the session with the tokens from URL
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || ''
          });
          
          // Handle session setting errors
          if (error) {
            setError('Invalid or expired reset link. Please request a new password reset.');
          // Session set successfully
          } else {
            setMessage('Ready to set your new password!');
            // Clear the URL hash for security
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        // No valid tokens found, check for existing session
        } else {
          // Check if user has an active session
          const { data: { session } } = await supabase.auth.getSession();
          // No active session found
          if (!session) {
            setError('No active password reset session. Please request a new password reset.');
          }
        }
      // Handle any errors during session verification
      } catch (err) {
        // Log the error for debugging
        console.error('Session check error:', err);
        // Set user-friendly error message
        setError('Failed to verify reset session. Please try again.');
      // Always execute regardless of success or failure
      } finally {
        // Mark session check as complete
        setSessionChecked(true);
      }
    };
    
    // Execute the session check function
    checkSession();
  // Empty dependency array - run only on component mount
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      return setError('Passwords do not match');
    }

    if (newPassword.length < 6) {
      return setError('Password must be at least 6 characters long');
    }

    try {
      setMessage('');
      setError('');
      setLoading(true);
      
      await updatePassword(newPassword);
      
      setIsSuccess(true);
      setMessage('Password updated successfully! Redirecting to your account...');
      
      // Redirect to home page after 2 seconds
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err: any) {
      console.error('Password update error:', err);
      setError('Failed to update password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!sessionChecked) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600" />
              <h2 className="mt-4 text-xl font-bold text-gray-900">
                Verifying reset link...
              </h2>
              <p className="mt-2 text-gray-600">
                Please wait while we verify your password reset request.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Set new password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter your new password below
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {isSuccess ? (
            <div className="text-center space-y-4">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-sm text-green-600 bg-green-50 p-4 rounded-lg">
                {message}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {message && !error && (
                <div className="flex items-center p-4 bg-blue-50 text-blue-700 rounded-lg">
                  <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                  <span className="text-sm">{message}</span>
                </div>
              )}
              
              {error && (
                <div className="flex items-center p-4 bg-red-50 text-red-700 rounded-lg">
                  <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}
              
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="newPassword"
                    name="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    disabled={!!error}
                    className="appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Minimum 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    disabled={!!error}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    disabled={!!error}
                    className="appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Repeat your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={!!error}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {!error && (
                <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <KeyRound className="w-5 h-5 mr-2" />
                      Update Password
                    </>
                  )}
                </button>
                </div>
              )}

              <div className="text-center">
                {error ? (
                  <button
                    type="button"
                    onClick={() => navigate('/reset-password')}
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Request new password reset
                  </button>
                ) : (
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Back to sign in
                </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordConfirm;