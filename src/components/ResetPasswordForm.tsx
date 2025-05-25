// Import React and useState hook for managing component state
import React, { useState } from 'react';
// Import Link for navigation and useNavigate hook for programmatic navigation
import { Link, useNavigate } from 'react-router-dom';
// Import useAuth hook from AuthContext to access authentication functions
import { useAuth } from '../contexts/AuthContext';
// Import icons from Lucide library for UI elements
import { Loader2, KeyRound } from 'lucide-react';

// Define ResetPasswordForm as a functional React component
const ResetPasswordForm: React.FC = () => {
  // State for email input field
  const [email, setEmail] = useState('');
  // State for success message
  const [message, setMessage] = useState('');
  // State for error messages
  const [error, setError] = useState('');
  // State for tracking loading status during form submission
  const [loading, setLoading] = useState(false);
  // Extract resetPassword function from useAuth hook
  const { resetPassword } = useAuth();
  // Initialize navigate function for programmatic navigation
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    // Prevent default form submission behavior
    e.preventDefault();

    try {
      // Clear any previous messages
      setMessage('');
      // Clear any previous error messages
      setError('');
      // Set loading state to true to show loading indicator
      setLoading(true);
      // Call resetPassword function from AuthContext with email
      await resetPassword(email);
      // Set success message after password reset email is sent
      setMessage('Check your email for password reset instructions');
    } catch (err) {
      // Set error message if password reset fails
      setError('Failed to reset password');
    } finally {
      // Reset loading state regardless of success or failure
      setLoading(false);
    }
  };

  // Render the password reset form
  return (
    // Container with styling for the form
    <div className="bg-white rounded-lg shadow p-4">
      {/* Form element with submit handler and spacing between elements */}
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Conditional rendering of error message if error state is not empty */}
        {error && (
          <div className="text-sm text-red-600">
            {error}
          </div>
        )}
        {/* Conditional rendering of success message if message state is not empty */}
        {message && (
          <div className="text-sm text-green-600">
            {message}
          </div>
        )}
        
        {/* Email input field container */}
        <div>
          {/* Email input with styling and event handler */}
          <input
            type="email"
            required
            className="w-full px-3 py-1.5 text-sm border rounded focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Container for back to login link */}
        <div className="text-xs text-center">
          {/* Link to login page */}
          <Link to="/login" className="text-blue-600 hover:text-blue-500">
            Back to login
          </Link>
        </div>

        {/* Submit button with loading state and styling */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center px-3 py-1.5 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {/* Conditional rendering based on loading state */}
          {loading ? (
            // Show spinning loader icon when loading
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            // Show reset password text and icon when not loading
            <>
              <KeyRound className="w-4 h-4 mr-2" />
              Reset Password
            </>
          )}
        </button>
      </form>
    </div>
  );
};

// Export the ResetPasswordForm component as the default export
export default ResetPasswordForm;