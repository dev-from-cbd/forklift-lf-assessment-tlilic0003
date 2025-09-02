// Import React and useState hook for component state management
import React, { useState } from 'react';
// Import useAuth hook from AuthContext for user authentication and profile management
import { useAuth } from '../contexts/AuthContext';
// Import icons from lucide-react library for UI elements
import { Mail, Key, Loader2, Save, AlertCircle, Eye, EyeOff } from 'lucide-react';

// Define UserProfile component as a functional component
const UserProfile: React.FC = () => {
  // Extract user object and update functions from AuthContext
  const { user, updateEmail, updatePassword } = useAuth();
  // State for new email input, initialized with current user email or empty string
  const [newEmail, setNewEmail] = useState(user?.email || '');
  // State for new password input, initialized as empty
  const [newPassword, setNewPassword] = useState('');
  // State for password confirmation input, initialized as empty
  const [confirmPassword, setConfirmPassword] = useState('');
  // State for tracking loading status during form submission
  const [loading, setLoading] = useState(false);
  // State for storing error messages
  const [error, setError] = useState('');
  // State for storing success messages
  const [success, setSuccess] = useState('');
  // State for toggling new password visibility
  const [showNewPassword, setShowNewPassword] = useState(false);
  // State for toggling confirm password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Handle form submission for profile updates
  const handleSubmit = async (e: React.FormEvent) => {
    // Prevent default form submission behavior
    e.preventDefault();
    // Clear any previous error messages
    setError('');
    // Clear any previous success messages
    setSuccess('');

    // Validate that passwords match if a new password is provided
    if (newPassword && newPassword !== confirmPassword) {
      // Return early with error message if passwords don't match
      return setError('Passwords do not match');
    }

    try {
      // Set loading state to true to show loading indicator
      setLoading(true);

      // Update email if it has changed from current user email
      if (newEmail !== user?.email) {
        // Call updateEmail function from AuthContext
        await updateEmail(newEmail);
      }

      // Update password if a new password is provided
      if (newPassword) {
        // Call updatePassword function from AuthContext
        await updatePassword(newPassword);
      }

      // Set success message after successful update
      setSuccess('Profile updated successfully');
      // Clear password fields after successful update
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      // Set error message if update fails
      setError('Failed to update profile');
    } finally {
      // Set loading state to false regardless of outcome
      setLoading(false);
    }
  };

  // Render the component UI
  return (
    // Main container with maximum width and auto margins
    <div className="max-w-2xl mx-auto">
      {/* White card with rounded corners and shadow */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Profile page title */}
        <h2 className="text-2xl font-semibold mb-6">User Profile</h2>

        {/* Form with submit handler and vertical spacing between elements */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Conditional rendering of error message */}
          {error && (
            // Red background alert box with rounded corners
            <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center">
              {/* Alert circle icon */}
              <AlertCircle className="w-5 h-5 mr-2" />
              {/* Display error message text */}
              {error}
            </div>
          )}

          {/* Conditional rendering of success message */}
          {success && (
            // Green background success box with rounded corners
            <div className="p-4 bg-green-50 text-green-700 rounded-lg flex items-center">
              {/* Save icon */}
              <Save className="w-5 h-5 mr-2" />
              {/* Display success message text */}
              {success}
            </div>
          )}

          {/* Email input field container with vertical spacing */}
          <div className="space-y-2">
            {/* Label for email input field */}
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            {/* Relative positioning container for input and icon */}
            <div className="relative">
              {/* Email input field */}
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {/* Mail icon positioned absolutely within the input */}
              <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>

          {/* New password input field container */}
          <div className="space-y-2">
            {/* Label for new password with instruction */}
            <label className="block text-sm font-medium text-gray-700">
              New Password (leave blank to keep current)
            </label>
            {/* Relative positioning container for input, icon and toggle button */}
            <div className="relative">
              {/* Password input field with dynamic type based on visibility state */}
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {/* Key icon for password field */}
              <Key className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              {/* Button to toggle password visibility */}
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {/* Conditional rendering of eye icon based on password visibility */}
                {showNewPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm password input field container */}
          <div className="space-y-2">
            {/* Label for confirm password field */}
            <label className="block text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            {/* Relative positioning container for input, icon and toggle button */}
            <div className="relative">
              {/* Confirm password input with dynamic type based on visibility state */}
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {/* Key icon for confirm password field */}
              <Key className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              {/* Button to toggle confirm password visibility */}
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {/* Conditional rendering of eye icon based on password visibility */}
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Submit button for the form */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {/* Conditional rendering based on loading state */}
            {loading ? (
              {/* Spinning loader icon when form is submitting */}
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                {/* Save icon when not loading */}
                <Save className="w-5 h-5 mr-2" />
                {/* Button text */}
                Save Changes
              </>
            )}
          </button>
        {/* End of form */}
        </form>
      {/* End of white card container */}
      </div>
    {/* End of main container */}
    </div>
  );
};

// Export the UserProfile component as default
export default UserProfile;