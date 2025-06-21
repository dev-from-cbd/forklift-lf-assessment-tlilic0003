import React, { useState } from 'react';
// Import authentication context hook
import { useAuth } from '../contexts/AuthContext';
// Import Lucide React icons for UI elements
import { Mail, Key, Loader2, Save, AlertCircle, Eye, EyeOff } from 'lucide-react';

// Define UserProfile component as a functional component
const UserProfile: React.FC = () => {
  // Get user data and update functions from auth context
  const { user, updateEmail, updatePassword } = useAuth();
  // State for storing new email input
  const [newEmail, setNewEmail] = useState(user?.email || '');
  // State for storing new password input
  const [newPassword, setNewPassword] = useState('');
  // State for storing confirm password input
  const [confirmPassword, setConfirmPassword] = useState('');
  // State for loading indicator
  const [loading, setLoading] = useState(false);
  // State for error message
  const [error, setError] = useState('');
  // State for success message
  const [success, setSuccess] = useState('');
  // State to toggle new password visibility
  const [showNewPassword, setShowNewPassword] = useState(false);
  // State to toggle confirm password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    setError(''); // Clear previous errors
    setSuccess(''); // Clear previous success messages

    // Validate password match
    if (newPassword && newPassword !== confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      setLoading(true); // Show loading state

      // Update email if changed
      if (newEmail !== user?.email) {
        await updateEmail(newEmail);
      }

      // Update password if new password provided
      if (newPassword) {
        await updatePassword(newPassword);
      }

      // Set success message and clear password fields
      setSuccess('Profile updated successfully');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError('Failed to update profile'); // Set error message
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  // Component render
  return (
    <div className="max-w-2xl mx-auto">
      {/* Profile container */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Profile header */}
        <h2 className="text-2xl font-semibold mb-6">User Profile</h2>

        {/* Profile form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error message display */}
          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              {error}
            </div>
          )}

          {/* Success message display */}
          {success && (
            <div className="p-4 bg-green-50 text-green-700 rounded-lg flex items-center">
              <Save className="w-5 h-5 mr-2" />
              {success}
            </div>
          )}

          {/* Email input field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>

          {/* New password input field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              New Password (leave blank to keep current)
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <Key className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              {/* Password visibility toggle */}
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showNewPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm password input field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <Key className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              {/* Password visibility toggle */}
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? (
              // Loading spinner
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              // Normal button content
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

export default UserProfile;