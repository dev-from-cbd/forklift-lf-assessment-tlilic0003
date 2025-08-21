import React, { useState } from 'react'; // Import React library and useState hook for state management
import { Link, useNavigate } from 'react-router-dom'; // Import Link component for navigation and useNavigate hook for programmatic navigation
import { useAuth } from '../contexts/AuthContext'; // Import authentication context hook for user authentication
import { Loader2, LogIn, Eye, EyeOff, AlertCircle } from 'lucide-react'; // Import icons from Lucide React icon library

const LoginForm: React.FC = () => { // Define LoginForm functional component with TypeScript typing
  const [email, setEmail] = useState(''); // State for storing user's email input
  const [password, setPassword] = useState(''); // State for storing user's password input
  const [error, setError] = useState(''); // State for storing error messages
  const [loading, setLoading] = useState(false); // State for tracking loading status during form submission
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility
  const { signIn } = useAuth(); // Extract signIn function from authentication context
  const navigate = useNavigate(); // Hook for programmatic navigation after successful login

  const handleSubmit = async (e: React.FormEvent) => { // Async function to handle form submission
    e.preventDefault(); // Prevent default form submission behavior
    try { // Start try-catch block for error handling
      setError(''); // Clear any previous error messages
      setLoading(true); // Set loading state to true to show loading indicator
      await signIn(email, password); // Attempt to sign in user with provided credentials
      navigate('/'); // Navigate to home page on successful login
    } catch (err: any) { // Catch any errors during login process
      console.error('Login error:', err); // Log error to console for debugging
      if (err.message?.includes('Invalid login credentials')) { // Check for invalid credentials error
        setError('Invalid email or password. Please check your credentials or use password recovery.'); // Set user-friendly error message
      } else if (err.message?.includes('Email not confirmed')) { // Check for unconfirmed email error
        setError('Please confirm your email address. Check your inbox and click the confirmation link.'); // Set email confirmation error message
      } else { // Handle any other errors
        setError('Login failed. Please try again or use password recovery.'); // Set generic error message
      }
    } finally { // Finally block executes regardless of success or failure
      setLoading(false); // Reset loading state to false
    }
  }; // End of handleSubmit function

  // Start of JSX return statement
  return (
    // Main container with full screen height, gray background, centered flex layout and responsive padding
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Header section container with responsive width and centering */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Main heading with top margin, center alignment, large text and bold weight */}
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        {/* Subtitle paragraph with top margin, center alignment, small text and gray color */}
        <p className="mt-2 text-center text-sm text-gray-600">
          Access your forklift training course
        </p>
      </div>

      {/* Form container with top margin, responsive width and centering */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {/* Form card with white background, padding, shadow and responsive styling */}
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Form element with submit handler and vertical spacing between children */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Conditional rendering of error message if error exists */}
            {error && (
              <div className="flex items-start p-4 bg-red-50 text-red-700 rounded-lg">
                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{error}</span>
              </div>
            )}
            
            {/* Email input field container */}
            <div>
              {/* Email field label with styling */}
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              {/* Input wrapper with top margin */}
              <div className="mt-1">
                {/* Email input field with full styling and validation */}
                <input
                  id="email" // Input field identifier
                  name="email" // Form field name
                  type="email" // Input type for email validation
                  autoComplete="email" // Browser autocomplete hint
                  required // Field is required for form submission
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" // Comprehensive styling classes
                  placeholder="Enter your email" // Placeholder text
                  value={email} // Controlled input value from state
                  onChange={(e) => setEmail(e.target.value)} // Update email state on input change
                />
              </div>
            </div>
            
            {/* Password input field container */}
            <div>
              {/* Password field label with styling */}
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              {/* Input wrapper with top margin and relative positioning for toggle button */}
              <div className="mt-1 relative">
                {/* Password input field with conditional type and full styling */}
                <input
                  id="password" // Input field identifier
                  name="password" // Form field name
                  type={showPassword ? "text" : "password"} // Dynamic input type based on visibility state
                  autoComplete="current-password" // Browser autocomplete hint
                  required // Field is required for form submission
                  className="appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" // Comprehensive styling with right padding for toggle button
                  placeholder="Enter your password" // Placeholder text
                  value={password} // Controlled input value from state
                  onChange={(e) => setPassword(e.target.value)} // Update password state on input change
                />
                {/* Password visibility toggle button */}
                <button
                  type="button" // Button type to prevent form submission
                  className="absolute inset-y-0 right-0 pr-3 flex items-center" // Absolute positioning on the right side with flex centering
                  onClick={() => setShowPassword(!showPassword)} // Toggle password visibility state
                >
                  {/* Conditional rendering of eye icons based on password visibility state */}
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" /> // Eye-off icon when password is visible
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" /> // Eye icon when password is hidden
                  )}
                </button>
              </div>
            </div>

            {/* Container for navigation links with space-between layout */}
            <div className="flex items-center justify-between">
              {/* Forgot password link container */}
              <div className="text-sm">
                {/* Link to password reset page */}
                <Link 
                  to="/reset-password" // Route to password reset page
                  className="font-medium text-blue-600 hover:text-blue-500" // Link styling with hover effect
                >
                  Forgot your password?
                </Link>
              </div>
              {/* Create account link container */}
              <div className="text-sm">
                {/* Link to registration page */}
                <Link 
                  to="/register" // Route to registration page
                  className="font-medium text-blue-600 hover:text-blue-500" // Link styling with hover effect
                >
                  Create account
                </Link>
              </div>
            </div>

            {/* Submit button container */}
            <div>
              {/* Form submit button with loading state and comprehensive styling */}
              <button
                type="submit" // Button type for form submission
                disabled={loading} // Disable button during loading state
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed" // Comprehensive button styling with states
              >
                {/* Conditional rendering of button content based on loading state */}
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" /> // Loading spinner icon
                ) : (
                  <> {/* Fragment for multiple elements */}
                    <LogIn className="w-5 h-5 mr-2" /> {/* Login icon with margin */}
                    Sign In {/* Button text */}
                  </>
                )}
              </button>
            </div>
          </form>
         </div>
       </div>
     </div>
   );
 };
 
 // Export LoginForm component as default export
 export default LoginForm;