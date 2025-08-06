// Import React and useState hook for component state management
import React, { useState } from 'react';
// Import Link for navigation links and useNavigate hook for programmatic navigation
import { Link, useNavigate } from 'react-router-dom';
// Import useAuth hook from AuthContext for authentication functionality
import { useAuth } from '../contexts/AuthContext';
// Import icons from lucide-react library for UI elements
import { Loader2, LogIn, Eye, EyeOff, AlertCircle } from 'lucide-react';

// Define LoginForm component as a functional component
const LoginForm: React.FC = () => {
  // State for email input field with empty initial value
  const [email, setEmail] = useState('');
  // State for password input field with empty initial value
  const [password, setPassword] = useState('');
  // State for error messages with empty initial value
  const [error, setError] = useState('');
  // State for loading status, initially set to false
  const [loading, setLoading] = useState(false);
  // State for password visibility toggle, initially set to false (password hidden)
  const [showPassword, setShowPassword] = useState(false);
  // Extract signIn function from useAuth hook
  const { signIn } = useAuth();
  // Initialize navigate function for programmatic navigation
  const navigate = useNavigate();

  // Handle form submission with async function
  const handleSubmit = async (e: React.FormEvent) => {
    // Prevent default form submission behavior
    e.preventDefault();
    try {
      // Clear any previous error messages
      setError('');
      // Set loading state to true to show loading indicator
      setLoading(true);
      // Call signIn function from AuthContext with email and password
      await signIn(email, password);
      // Navigate to home page after successful login
      navigate('/');
    } catch (err: any) {
      // Log error to console for debugging
      console.error('Login error:', err);
      // Handle different error scenarios with specific error messages
      if (err.message?.includes('Invalid login credentials')) {
        // Show error message for invalid credentials
        setError('Invalid email or password. Please check your credentials or use password recovery.');
      } else if (err.message?.includes('Email not confirmed')) {
        // Show error message for unconfirmed email
        setError('Please confirm your email address. Check your inbox and click the confirmation link.');
      } else {
        // Show generic error message for other errors
        setError('Login failed. Please try again or use password recovery.');
      }
    } finally {
      // Set loading state back to false regardless of success or failure
      setLoading(false);
    }
  };

  // Return JSX for rendering the login form
  return (
    // Main container with full height, light background, and centered content
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Header container with responsive width */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Main heading for the login page */}
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        {/* Subheading with additional context */}
        <p className="mt-2 text-center text-sm text-gray-600">
          Access your forklift training course
        </p>
      </div>

      {/* Form container with responsive width and margin */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {/* White card with shadow and padding for the form */}
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Form element with submit handler and vertical spacing */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Conditional rendering of error message if error state is not empty */}
            {error && (
              // Error message container with red styling
              <div className="flex items-start p-4 bg-red-50 text-red-700 rounded-lg">
                {/* Alert circle icon for error */}
                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                {/* Error message text */}
                <span className="text-sm">{error}</span>
              </div>
            )}
            
            {/* Email input field container */}
            <div>
              {/* Label for email input field */}
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              {/* Input container with margin */}
              <div className="mt-1">
                {/* Email input field */}
                <input
                  id="email" // ID for label association
                  name="email" // Name for form submission
                  type="email" // Email type for validation and keyboard
                  autoComplete="email" // Browser autocomplete hint
                  required // Field is required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" // Styling classes
                  placeholder="Enter your email" // Placeholder text
                  value={email} // Controlled component value from state
                  onChange={(e) => setEmail(e.target.value)} // Update state on change
                />
              </div>
            </div>
            
            {/* Password input field container */}
            <div>
              {/* Label for password input field */}
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              {/* Input container with relative positioning for the toggle button */}
              <div className="mt-1 relative">
                {/* Password input field */}
                <input
                  id="password" // ID for label association
                  name="password" // Name for form submission
                  type={showPassword ? "text" : "password"} // Dynamic type based on showPassword state
                  autoComplete="current-password" // Browser autocomplete hint
                  required // Field is required
                  className="appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" // Styling with extra right padding for the toggle button
                  placeholder="Enter your password" // Placeholder text
                  value={password} // Controlled component value from state
                  onChange={(e) => setPassword(e.target.value)} // Update state on change
                />
                {/* Password visibility toggle button */}
                <button
                  type="button" // Button type that doesn't submit the form
                  className="absolute inset-y-0 right-0 pr-3 flex items-center" // Positioning at the right side of input
                  onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
                >
                  {/* Conditional rendering of eye icon based on password visibility */}
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" /> // Icon for hiding password
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" /> // Icon for showing password
                  )}
                </button>
              </div>
            </div>

            {/* Container for links with flex layout to position items on opposite sides */}
            <div className="flex items-center justify-between">
              {/* Password reset link container */}
              <div className="text-sm">
                {/* Link to password reset page */}
                <Link 
                  to="/reset-password" // Route to password reset page
                  className="font-medium text-blue-600 hover:text-blue-500" // Styling for link
                >
                  Forgot your password?
                </Link>
              </div>
              {/* Registration link container */}
              <div className="text-sm">
                {/* Link to registration page */}
                <Link 
                  to="/register" // Route to registration page
                  className="font-medium text-blue-600 hover:text-blue-500" // Styling for link
                >
                  Create account
                </Link>
              </div>
            </div>

            {/* Submit button container */}
            <div>
              {/* Submit button with conditional disabled state */}
              <button
                type="submit" // Button type for form submission
                disabled={loading} // Disable button when loading
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed" // Styling with disabled state
              >
                {/* Conditional rendering based on loading state */}
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" /> // Loading spinner when loading
                ) : (
                  // Content when not loading
                  <>
                    <LogIn className="w-5 h-5 mr-2" /> {/* Login icon */}
                    Sign In {/* Button text */}
                  </>
                )}
              </button>
            </div>
          {/* End of form */}
          </form>
        {/* End of white card */}
        </div>
      {/* End of form container */}
      </div>
    {/* End of main container */}
    </div>
  );
};

// Export the LoginForm component as the default export
export default LoginForm;