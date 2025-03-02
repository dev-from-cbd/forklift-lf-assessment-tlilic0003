import React, { useState } from "react"; // Importing React and the useState hook for state management
import { Link, useNavigate } from "react-router-dom"; // Importing Link for navigation and useNavigate for programmatic redirection
import { useAuth } from "../contexts/AuthContext"; // Importing the authentication context for user sign-up
import { Loader2, UserPlus, Eye, EyeOff } from "lucide-react"; // Importing icons for UI elements

const RegisterForm: React.FC = () => {
  // Defining state variables for form fields and UI states
  const [email, setEmail] = useState(""); // Email input state
  const [password, setPassword] = useState(""); // Password input state
  const [confirmPassword, setConfirmPassword] = useState(""); // Confirm password input state
  const [error, setError] = useState(""); // Error message state
  const [loading, setLoading] = useState(false); // Loading state for the form submission
  const [showPassword, setShowPassword] = useState(false); // Toggle visibility of password field
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Toggle visibility of confirm password field
  const { signUp } = useAuth(); // Getting signUp function from authentication context
  const navigate = useNavigate(); // Getting navigate function for redirection

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevents default form submission behavior

    if (password !== confirmPassword) {
      return setError("Passwords do not match"); // Checks if passwords match, otherwise sets an error message
    }

    try {
      setError(""); // Clear previous errors
      setLoading(true); // Set loading state to true
      await signUp(email, password); // Attempt to sign up the user
      navigate("/"); // Redirect to home page upon successful registration
    } catch (err) {
      setError("Failed to create an account"); // Display error message if sign-up fails
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      {" "}
      {/* Wrapper with styling */}
      <h2 className="text-xl font-semibold text-center mb-4">
        Create Account
      </h2>{" "}
      {/* Form heading */}
      <form onSubmit={handleSubmit} className="space-y-3">
        {" "}
        {/* Form with submit handler */}
        {error && (
          <div className="text-sm text-red-600">
            {" "}
            {/* Displays error message if any */}
            {error}
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
        <div className="relative">
          {" "}
          {/* Password input field with visibility toggle */}
          <input
            type={showPassword ? "text" : "password"} // Toggles password visibility
            required
            className="w-full px-3 py-1.5 text-sm border rounded focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 pr-10"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Updates password state
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            onClick={() => setShowPassword(!showPassword)} // Toggles showPassword state
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" /> // Show EyeOff icon when password is visible
            ) : (
              <Eye className="w-4 h-4" /> // Show Eye icon when password is hidden
            )}
          </button>
        </div>
        <div className="relative">
          {" "}
          {/* Confirm password input field with visibility toggle */}
          <input
            type={showConfirmPassword ? "text" : "password"} // Toggles confirm password visibility
            required
            className="w-full px-3 py-1.5 text-sm border rounded focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 pr-10"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)} // Updates confirmPassword state
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)} // Toggles showConfirmPassword state
          >
            {showConfirmPassword ? (
              <EyeOff className="w-4 h-4" /> // Show EyeOff icon when confirm password is visible
            ) : (
              <Eye className="w-4 h-4" /> // Show Eye icon when confirm password is hidden
            )}
          </button>
        </div>
        <div className="text-xs text-center">
          {" "}
          {/* Link to login page */}
          <Link to="/login" className="text-blue-600 hover:text-blue-500">
            Already have an account?
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
              <UserPlus className="w-4 h-4 mr-2" /> {/* Icon for sign-up */}
              Sign up
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default RegisterForm; // Exporting the component for use elsewhere
