// Import React and useState hook for component state management
import React, { useState } from 'react';
// Import routing components for navigation and URL parameter handling
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
// Import authentication context for user registration
import { useAuth } from '../contexts/AuthContext';
// Import icons from Lucide React for UI elements
import { Loader2, UserPlus, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

// Define RegisterForm functional component with TypeScript typing
const RegisterForm: React.FC = () => {
  // Hook to access URL search parameters
  const [searchParams] = useSearchParams();
  // State for email input field
  const [email, setEmail] = useState('');
  // State for password input field
  const [password, setPassword] = useState('');
  // State for password confirmation input field
  const [confirmPassword, setConfirmPassword] = useState('');
  // State for error messages display
  const [error, setError] = useState('');
  // State for loading indicator during form submission
  const [loading, setLoading] = useState(false);
  // State to toggle password visibility
  const [showPassword, setShowPassword] = useState(false);
  // State to toggle confirm password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // State to track successful registration
  const [isSuccess, setIsSuccess] = useState(false);
  // Destructure signUp function from authentication context
  const { signUp } = useAuth();
  // Hook for programmatic navigation
  const navigate = useNavigate();
  // Extract referral code from URL parameters
  const referralCode = searchParams.get('ref');

  // Async function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    // Prevent default form submission behavior
    e.preventDefault();

    // Validate that passwords match
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    // Validate minimum password length
    if (password.length < 6) {
      return setError('Password must be at least 6 characters long');
    }

    try {
      // Clear any previous error messages
      setError('');
      // Set loading state to true
      setLoading(true);
      
      // Call signUp function with email and password
      await signUp(email, password);
      
      // Set success state to true
      setIsSuccess(true);
      
      // Automatically redirect to home page after 2 seconds
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err: any) {
      // Log registration error to console
      console.error('Registration error:', err);
      // Handle specific error cases with user-friendly messages
      if (err.message?.includes('User already registered')) {
        setError('User with this email already exists. Please try signing in.');
      } else if (err.message?.includes('Password should be at least 6 characters')) {
        setError('Password must be at least 6 characters long');
      } else {
        // Generic error message for other registration failures
        setError('Registration failed. Please try again.');
      }
    } finally {
      // Always set loading to false when done
      setLoading(false);
    }
  };

  // Return JSX for the registration form component
  return (
    // Main container with full height and centered layout
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Header section with title and description */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Main heading for registration form */}
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        {/* Subtitle explaining the purpose */}
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign up to access the full training course
        </p>
      </div>

      {/* Form container with responsive width */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {/* White card container with shadow and padding */}
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Conditional rendering: success message or registration form */}
          {isSuccess ? (
            // Success state display
            <div className="text-center space-y-4">
              {/* Success icon container */}
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                {/* Check circle icon for success */}
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              {/* Success message */}
              <div className="text-sm text-green-600 bg-green-50 p-4 rounded-lg">
                Account created successfully! Redirecting you to the course...
              </div>
              {/* Conditional referral success message */}
              {referralCode && (
                <div className="text-sm text-blue-600 bg-blue-50 p-4 rounded-lg">
                  ✨ You were referred by a friend! You'll both benefit from this partnership.
                </div>
              )}
            </div>
          ) : (
            // Registration form
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Referral code notification */}
              {referralCode && (
                <div className="p-4 bg-green-50 text-green-700 rounded-lg flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                  <span className="text-sm">
                    🎉 You're signing up with a referral code! You and your friend will both benefit.
                  </span>
                </div>
              )}
              
              {/* Error message display */}
              {error && (
                <div className="flex items-start p-4 bg-red-50 text-red-700 rounded-lg">
                  <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{error}</span>
                </div>
              )}
              
              {/* Email input field */}
              <div>
                {/* Email field label */}
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                {/* Email input container */}
                <div className="mt-1">
                  {/* Email input element */}
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter your email"
                  />
                </div>
                </div>
              
              {/* Password input field */}
              <div>
                {/* Password field label */}
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                {/* Password input container with relative positioning */}
                <div className="mt-1 relative">
                  {/* Password input element with dynamic type */}
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    className="appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Minimum 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {/* Password visibility toggle button */}
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {/* Conditional icon based on password visibility */}
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
              
              {/* Confirm password input field */}
              <div>
                {/* Confirm password field label */}
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm password
                </label>
                {/* Confirm password input container with relative positioning */}
                <div className="mt-1 relative">
                  {/* Confirm password input element with dynamic type */}
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    className="appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Repeat your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  {/* Confirm password visibility toggle button */}
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {/* Conditional icon based on confirm password visibility */}
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Link to login page */}
              <div className="text-center">
                {/* Navigation link to login page */}
                <Link 
                  to="/login" 
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Already have an account? Sign in
                </Link>
              </div>

              {/* Submit button container */}
              <div>
                {/* Form submit button with loading state */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {/* Conditional button content based on loading state */}
                  {loading ? (
                    // Loading spinner when form is submitting
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    // Normal button content with icon and text
                    <>
                      <UserPlus className="w-5 h-5 mr-2" />
                      Create Account
                    </>
                  )}
                </button>
              </div>
            {/* End of form */}
            </form>
          )}
        {/* End of white card container */}
        </div>
      {/* End of form container */}
      </div>
    {/* End of main container */}
    </div>
  );
};

// Export the RegisterForm component as default
export default RegisterForm;