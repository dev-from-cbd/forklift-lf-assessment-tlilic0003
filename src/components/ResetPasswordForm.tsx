import React, { useState } from 'react'; // Importing React and the useState hook for state management
import { Link, useNavigate } from 'react-router-dom'; // Importing Link for navigation and useNavigate for programmatic redirection
import { useAuth } from '../contexts/AuthContext'; // Importing the authentication context for password reset
import { Loader2, KeyRound } from 'lucide-react'; // Importing icons for UI elements

const ResetPasswordForm: React.FC = () => {
  // Defining state variables for form fields and UI states
  const [email, setEmail] = useState(''); // Email input state
  const [message, setMessage] = useState(''); // Success message state
  const [error, setError] = useState(''); // Error message state
  const [loading, setLoading] = useState(false); // Loading state for the form submission
  const { resetPassword } = useAuth(); // Getting resetPassword function from authentication context
  const navigate = useNavigate(); // Getting navigate function for redirection

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevents default form submission behavior

    try {
      setMessage(''); // Clear previous success message
      setError(''); // Clear previous errors
      setLoading(true); // Set loading state to true
      await resetPassword(email); // Attempt to send a password reset email
      setMessage('Check your email for password reset instructions'); // Show success message
    } catch (err) {
      setError('Failed to reset password'); // Display error message if request fails
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4"> {/* Wrapper with styling */}
      <form onSubmit={handleSubmit} className="space-y-3"> {/* Form with submit handler */}
        {error && (
          <div className="text-sm text-red-600"> {/* Displays error message if any */}
            {error}
          </div>
        )}
        {message && (
          <div className="text-sm text-green-600"> {/* Displays success message if any */}
            {message}
          </div>
        )}
        
        <div>
          <input
            type="email"
            required
            className="w-full px-3 py-1.5 text-sm border rounded focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Updates email state on input change
          />
        </div>

        <div className="text-xs text-center"> {/* Link to navigate back to login page */}
          <Link to="/login" className="text-blue-600 hover:text-blue-500">
            Back to login
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading} // Disable button when loading
          className="w-full flex justify-center items-center px-3 py-1.5 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" /> // Show loader icon when loading
          ) : (
            <>
              <KeyRound className="w-4 h-4 mr-2" /> {/* Icon for password reset */}
              Reset Password
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordForm; // Exporting the component for use elsewhere
