// Import React and useState hook for component state management
import React, { useState } from 'react';
// Import Link component for navigation between routes
import { Link } from 'react-router-dom';
// Import authentication context hook
import { useAuth } from '../contexts/AuthContext';
// Import icons from Lucide React library
import { Loader2, KeyRound, CheckCircle, AlertCircle } from 'lucide-react';

// Functional component for password reset form
const ResetPasswordForm: React.FC = () => {
  // State for email input field
  const [email, setEmail] = useState('');
  // State for success messages
  const [message, setMessage] = useState('');
  // State for error messages
  const [error, setError] = useState('');
  // State for loading indicator
  const [loading, setLoading] = useState(false);
  // State for success completion status
  const [isSuccess, setIsSuccess] = useState(false);
  // Extract resetPassword function from auth context
  const { resetPassword } = useAuth();

  // Async function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    // Prevent default form submission behavior
    e.preventDefault();

    // Try to send password reset email
    try {
      // Clear any previous messages
      setMessage('');
      // Clear any previous errors
      setError('');
      // Set loading state to true
      setLoading(true);
      
      // Call resetPassword function with email
      await resetPassword(email);
      
      // Set success state to true
      setIsSuccess(true);
      // Set success message for user
      setMessage('Password reset instructions have been sent to your email. Please check your spam folder if you don\'t see the email.');
    // Handle any errors during password reset
    } catch (err: any) {
      // Log error for debugging
      console.error('Password reset error:', err);
      // Set user-friendly error message
      setError('Failed to send password reset email. Please check your email address.');
    // Always execute regardless of success or failure
    } finally {
      // Set loading state to false
      setLoading(false);
    }
  };

  // Return JSX for the password reset form
  return (
    // Main container with full height and centered layout
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Header section with title and description */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Main title for password reset */}
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Reset your password
        </h2>
        {/* Subtitle with instructions */}
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter your email to receive password reset instructions
        </p>
      </div>

      {/* Form container with responsive width */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {/* White card container with shadow */}
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Conditional rendering: show success message or form */}
           {isSuccess ? (
             // Success state display
             <div className="text-center space-y-4">
              {/* Success icon container */}
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                {/* Check circle icon */}
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              {/* Success message display */}
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
          // Form section when not in success state
           ) : (
             // Password reset form
             <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error message display */}
              {error && (
                <div className="flex items-center p-4 bg-red-50 text-red-700 rounded-lg">
                  {/* Alert circle icon */}
                  <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                  {/* Error message text */}
                  <span className="text-sm">{error}</span>
                </div>
              )}
              
              {/* Email input field container */}
              <div>
                {/* Email field label */}
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                {/* Input field container */}
                <div className="mt-1">
                  {/* Email input field */}
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

              {/* Submit button container */}
              <div>
                {/* Submit button with loading state */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {/* Conditional button content based on loading state */}
                  {loading ? (
                    // Loading spinner
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    // Normal button content with icon and text
                    <>
                      {/* Key icon */}
                      <KeyRound className="w-5 h-5 mr-2" />
                      Send Instructions
                    </>
                  )}
                </button>
              </div>

              {/* Back to login link container */}
              <div className="text-center">
                {/* Navigation link back to login page */}
                <Link 
                  to="/login" 
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Back to sign in
                </Link>
              </div>
            {/* End of form */}
            </form>
          {/* End of conditional rendering */}
          )}
        {/* End of white card container */}
        </div>
      {/* End of form container */}
      </div>
    {/* End of main container */}
     </div>
   );
  // End of component function
  };

// Export component as default
export default ResetPasswordForm;