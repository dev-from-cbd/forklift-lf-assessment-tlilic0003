// Import React and useState hook for managing component state
import React, { useState } from 'react';
// Import Link for navigation and useNavigate hook for programmatic navigation
import { Link, useNavigate } from 'react-router-dom';
// Import useAuth hook from AuthContext to access authentication functions
import { useAuth } from '../contexts/AuthContext';
// Import icons from Lucide library for UI elements
import { Loader2, UserPlus, Eye, EyeOff } from 'lucide-react';

// Define RegisterForm as a functional React component
const RegisterForm: React.FC = () => {
  // State for email input field
  const [email, setEmail] = useState('');
  // State for password input field
  const [password, setPassword] = useState('');
  // State for confirm password input field
  const [confirmPassword, setConfirmPassword] = useState('');
  // State for error messages
  const [error, setError] = useState('');
  // State for tracking loading status during form submission
  const [loading, setLoading] = useState(false);
  // State for toggling password visibility
  const [showPassword, setShowPassword] = useState(false);
  // State for toggling confirm password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // Extract signUp function from useAuth hook
  const { signUp } = useAuth();
  // Initialize navigate function for programmatic navigation
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    // Prevent default form submission behavior
    e.preventDefault();

    // Validate that passwords match
    if (password !== confirmPassword) {
      // Set error message and exit function if passwords don't match
      return setError('Passwords do not match');
    }

    try {
      // Clear any previous error messages
      setError('');
      // Set loading state to true to show loading indicator
      setLoading(true);
      // Call signUp function from AuthContext with email and password
      await signUp(email, password);
      // Navigate to home page after successful registration
      navigate('/');
    } catch (err) {
      // Set error message if registration fails
      setError('Failed to create an account');
    } finally {
      // Reset loading state regardless of success or failure
      setLoading(false);
    }
  };

  // Render the registration form
  return (
    // Container with styling for the form
    <div className="bg-white rounded-lg shadow p-4">
      {/* Form title */}
      <h2 className="text-xl font-semibold text-center mb-4">Create Account</h2>
      {/* Form element with submit handler and spacing between elements */}
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Conditional rendering of error message if error state is not empty */}
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
            {/* Conditional rendering of eye icon based on password visibility */}
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
        
        {/* Confirm password input field container with relative positioning for the toggle button */}
        <div className="relative">
          {/* Confirm password input with dynamic type based on showConfirmPassword state */}
          <input
            type={showConfirmPassword ? "text" : "password"}
            required
            className="w-full px-3 py-1.5 text-sm border rounded focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 pr-10"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {/* Button to toggle confirm password visibility */}
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {/* Conditional rendering of eye icon based on confirm password visibility */}
            {showConfirmPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Container for login link */}
        <div className="text-xs text-center">
          {/* Link to login page for users who already have an account */}
          <Link to="/login" className="text-blue-600 hover:text-blue-500">
            Already have an account?
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
            // Show sign up text and icon when not loading
            <>
              <UserPlus className="w-4 h-4 mr-2" />
              Sign up
            </>
          )}
        </button>
      </form>
    </div>
  );
};

// Export the RegisterForm component as the default export
export default RegisterForm;