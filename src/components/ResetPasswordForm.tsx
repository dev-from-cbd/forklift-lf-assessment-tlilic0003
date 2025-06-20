import React, { useState } from 'react';
// Import React Router Link component for navigation
import { Link } from 'react-router-dom';
// Import authentication context hook
import { useAuth } from '../contexts/AuthContext';
// Import Lucide React icons for UI elements
import { Loader2, KeyRound, CheckCircle, AlertCircle } from 'lucide-react';

// Define ResetPasswordForm component as a functional component
const ResetPasswordForm: React.FC = () => {
  // State for storing user's email input
  const [email, setEmail] = useState('');
  // State for success message
  const [message, setMessage] = useState('');
  // State for error message
  const [error, setError] = useState('');
  // State for loading indicator
  const [loading, setLoading] = useState(false);
  // State to track successful password reset request
  const [isSuccess, setIsSuccess] = useState(false);
  // Get resetPassword function from auth context
  const { resetPassword } = useAuth();

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission

    try {
      setMessage(''); // Clear previous messages
      setError(''); // Clear previous errors
      setLoading(true); // Show loading state
      
      // Call resetPassword function from auth context
      await resetPassword(email);
      
      setIsSuccess(true); // Mark as successful
      // Set success message with instructions
      setMessage('Password reset instructions have been sent to your email. Please check your spam folder if you don\'t see the email.');
    } catch (err: any) {
      console.error('Password reset error:', err); // Log error
      // Set user-friendly error message
      setError('Failed to send password reset email. Please check your email address.');
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  // Component render
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Header section */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Reset your password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter your email to receive password reset instructions
        </p>
      </div>

      {/* Main form container */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Success state */}
          {isSuccess ? (
            <div className="text-center space-y-4">
              {/* Success icon */}
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              {/* Success message */}
              <div className="text-sm text-green-600 bg-green-50 p-4 rounded-lg">
                {message}
              </div>
              {/* Back to login link */}
              <div className="text-center">
                <Link 
                  to="/login" 
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Back to sign in
                </Link>
              </div>
            </div>
          ) : (
            // Password reset form
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error message display */}
              {error && (
                <div className="flex items-center p-4 bg-red-50 text-red-700 rounded-lg">
                  <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}
              
              {/* Email input field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Submit button */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    // Loading spinner
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    // Normal button content
                    <>
                      <KeyRound className="w-5 h-5 mr-2" />
                      Send Instructions
                    </>
                  )}
                </button>
              </div>

              {/* Back to login link */}
              <div className="text-center">
                <Link 
                  to="/login" 
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Back to sign in
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordForm;