// Import React and useState hook for managing component state
import React, { useState } from 'react';
// Import useAuth hook from AuthContext to access authentication functions and user data
import { useAuth } from '../contexts/AuthContext';
// Import icons from Lucide library for UI elements
import { Mail, Key, Loader2, Save, AlertCircle, Eye, EyeOff } from 'lucide-react';

// Define UserProfile as a functional React component
const UserProfile: React.FC = () => {
  // Extract user object and authentication functions from useAuth hook
  const { user, updateEmail, updatePassword } = useAuth();
  // State for email input field, initialized with current user email or empty string
  const [newEmail, setNewEmail] = useState(user?.email || '');
  // State for new password input field
  const [newPassword, setNewPassword] = useState('');
  // State for confirm password input field
  const [confirmPassword, setConfirmPassword] = useState('');
  // State for tracking loading status during form submission
  const [loading, setLoading] = useState(false);
  // State for error messages
  const [error, setError] = useState('');
  // State for success messages
  const [success, setSuccess] = useState('');
  // State for toggling new password visibility
  const [showNewPassword, setShowNewPassword] = useState(false);
  // State for toggling confirm password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    // Prevent default form submission behavior
    e.preventDefault();
    // Clear any previous error messages
    setError('');
    // Clear any previous success messages
    setSuccess('');

    // Validate that passwords match if a new password is provided
    if (newPassword && newPassword !== confirmPassword) {
      // Set error message and exit function if passwords don't match
      return setError('Passwords do not match');
    }

    try {
      // Set loading state to true to show loading indicator
      setLoading(true);

      // Update email if it has changed
      if (newEmail !== user?.email) {
        await updateEmail(newEmail);
      }

      // Update password if a new one is provided
      if (newPassword) {
        await updatePassword(newPassword);
      }

      // Set success message after profile update
      setSuccess('Profile updated successfully');
      // Clear password fields after successful update
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      // Set error message if profile update fails
      setError('Failed to update profile');
    } finally {
      // Reset loading state regardless of success or failure
      setLoading(false);
    }
  };

  // Render the user profile form
  return (
    // Container with max width and auto margins
    <div className="max-w-2xl mx-auto">
      // Card container with styling
      <div className="bg-white rounded-lg shadow-lg p-6">
        // Profile title
        <h2 className="text-2xl font-semibold mb-6">User Profile</h2>

        // Form element with submit handler and spacing between elements
        <form onSubmit={handleSubmit} className="space-y-6">
          // Conditional rendering of error message if error state is not empty
          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center">
              // Alert icon for error message
              <AlertCircle className="w-5 h-5 mr-2" />
              // Display error message
              {error}
            </div>
          )}

          // Conditional rendering of success message if success state is not empty
          {success && (
            <div className="p-4 bg-green-50 text-green-700 rounded-lg flex items-center">
              // Save icon for success message
              <Save className="w-5 h-5 mr-2" />
              // Display success message
              {success}
            </div>
          )}

          // Email input field container
          <div className="space-y-2">
            // Label for email input
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            // Relative positioning container for input and icon
            <div className="relative">
              // Email input with styling and event handler
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              // Mail icon positioned absolutely within the input
              <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>

          // New password input field container
          <div className="space-y-2">
            // Label for new password input with instruction
            <label className="block text-sm font-medium text-gray-700">
              New Password (leave blank to keep current)
            </label>
            // Relative positioning container for input and icons
            <div className="relative">
              // Password input with dynamic type based on showNewPassword state
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              // Key icon positioned absolutely within the input
              <Key className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              // Button to toggle password visibility
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                // Conditional rendering of eye icon based on password visibility
                {showNewPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          // Confirm password input field container
          <div className="space-y-2">
            // Label for confirm password input
            <label className="block text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            // Relative positioning container for input and icons
            <div className="relative">
              // Confirm password input with dynamic type based on showConfirmPassword state
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              // Key icon positioned absolutely within the input
              <Key className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              // Button to toggle confirm password visibility
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                // Conditional rendering of eye icon based on confirm password visibility
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          // Submit button with loading state and styling
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            // Conditional rendering based on loading state
            {loading ? (
              // Show spinning loader icon when loading
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              // Show save changes text and icon when not loading
              <>
                <Save className="w-5 h-5 mr-2" />
                Save Changes
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

// Export the UserProfile component as the default export
export default UserProfile;