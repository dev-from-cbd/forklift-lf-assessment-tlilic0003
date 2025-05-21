// Import React and useState hook for managing component state
import React, { useState } from 'react';
// Import routing components from react-router-dom
import { Link, useNavigate } from 'react-router-dom';
// Import custom authentication context hook
import { useAuth } from '../contexts/AuthContext';
// Import icons from Lucide library
import { Loader2, LogIn, Eye, EyeOff } from 'lucide-react';

// Define LoginForm as a functional component
const LoginForm: React.FC = () => {
  // State for storing user email input
  const [email, setEmail] = useState('');
  // State for storing user password input
  const [password, setPassword] = useState('');
  // State for storing error messages
  const [error, setError] = useState('');
  // State for tracking loading status during form submission
  const [loading, setLoading] = useState(false);
  // State for toggling password visibility
  const [showPassword, setShowPassword] = useState(false);
  // Get signIn function from auth context
  const { signIn } = useAuth();
  // Get navigate function for programmatic navigation
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    // Prevent default form submission behavior
    e.preventDefault();
    try {
      // Clear any previous errors
      setError('');
      // Set loading state to true to show loading indicator
      setLoading(true);
      // Call signIn function with user credentials
      await signIn(email, password);
      // Navigate to home page after successful login
      navigate('/');
    } catch (err) {
      // Set error message if login fails
      setError('Failed to sign in. Please check your credentials.');
    } finally {
      // Set loading state to false regardless of outcome
      setLoading(false);
    }
  };

  // Render the login form
  return (
    // Container with styling for the form
    <div className="bg-white rounded-lg shadow p-4">
      // Form element with submit handler and spacing between elements
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Conditionally render error message if it exists */}
        {error && (
          <div className="text-sm text-red-600">
            {error}
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
        
        {/* Password input field container with relative positioning for the toggle button */}
        <div className="relative">
          {/* Password input with dynamic type based on showPassword state */}
          <input
            type={showPassword ? "text" : "password"}
            required
            className="w-full px-3 py-1.5 text-sm border rounded focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 pr-10"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {/* Button to toggle password visibility */}
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            onClick={() => setShowPassword(!showPassword)}
          >
            {/* Conditionally render eye icon based on password visibility state */}
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Container for forgot password and create account links */}
        <div className="flex items-center justify-between text-xs">
          {/* Link to password reset page */}
          <Link to="/reset-password" className="text-blue-600 hover:text-blue-500">
            Forgot password?
          </Link>
          {/* Link to registration page */}
          <Link to="/register" className="text-blue-600 hover:text-blue-500">
            Create account
          </Link>
        </div>

        {/* Submit button with loading state handling */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center px-3 py-1.5 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {/* Conditionally render loading spinner or login text with icon */}
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              {/* Login icon */}
              <LogIn className="w-4 h-4 mr-2" />
              {/* Login text */}
              Log in
            </>
          )}
        </button>
      </form>
    </div>
  );
};

// Export the LoginForm component as default
export default LoginForm;