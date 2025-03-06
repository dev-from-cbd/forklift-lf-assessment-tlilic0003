import React, { useState } from "react"; // Importing React and the useState hook for state management
import { useAuth } from "../contexts/AuthContext"; // Importing the authentication context for user profile management
import {
  Mail,
  Key,
  Loader2,
  Save,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react"; // Importing icons for UI elements

const UserProfile: React.FC = () => {
  const { user, updateEmail, updatePassword } = useAuth(); // Extracting user and update functions from authentication context
  const [newEmail, setNewEmail] = useState(user?.email || ""); // State for the new email input
  const [newPassword, setNewPassword] = useState(""); // State for the new password input
  const [confirmPassword, setConfirmPassword] = useState(""); // State for confirming the new password
  const [loading, setLoading] = useState(false); // Loading state for form submission
  const [error, setError] = useState(""); // State to store error messages
  const [success, setSuccess] = useState(""); // State to store success messages
  const [showNewPassword, setShowNewPassword] = useState(false); // Toggle for showing/hiding new password
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Toggle for showing/hiding confirm password

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevents default form submission behavior
    setError(""); // Clear previous error messages
    setSuccess(""); // Clear previous success messages

    if (newPassword && newPassword !== confirmPassword) {
      return setError("Passwords do not match"); // Validate password match
    }

    try {
      setLoading(true); // Set loading state to true

      if (newEmail !== user?.email) {
        await updateEmail(newEmail); // Update user email if changed
      }

      if (newPassword) {
        await updatePassword(newPassword); // Update user password if provided
      }

      setSuccess("Profile updated successfully"); // Set success message
      setNewPassword(""); // Clear password fields
      setConfirmPassword("");
    } catch (err) {
      setError("Failed to update profile"); // Set error message if update fails
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {" "}
      {/* Container for the profile form */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        {" "}
        {/* Card with styling */}
        <h2 className="text-2xl font-semibold mb-6">User Profile</h2>{" "}
        {/* Profile heading */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {" "}
          {/* Form with submit handler */}
          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center">
              {" "}
              {/* Display error message if any */}
              <AlertCircle className="w-5 h-5 mr-2" />
              {error}
            </div>
          )}
          {success && (
            <div className="p-4 bg-green-50 text-green-700 rounded-lg flex items-center">
              {" "}
              {/* Display success message if any */}
              <Save className="w-5 h-5 mr-2" />
              {success}
            </div>
          )}
          <div className="space-y-2">
            {" "}
            {/* Email input field */}
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)} // Update email state on input change
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />{" "}
              {/* Email icon */}
            </div>
          </div>
          <div className="space-y-2">
            {" "}
            {/* New password input field with toggle */}
            <label className="block text-sm font-medium text-gray-700">
              New Password (leave blank to keep current)
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"} // Toggle password visibility
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)} // Update password state
                className="w-full pl-10 pr-12 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <Key className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />{" "}
              {/* Password icon */}
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)} // Toggle password visibility
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showNewPassword ? (
                  <EyeOff className="w-5 h-5" /> // Show EyeOff icon when password is visible
                ) : (
                  <Eye className="w-5 h-5" /> // Show Eye icon when password is hidden
                )}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            {" "}
            {/* Confirm password input field with toggle */}
            <label className="block text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"} // Toggle confirm password visibility
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)} // Update confirmPassword state
                className="w-full pl-10 pr-12 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <Key className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />{" "}
              {/* Password icon */}
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)} // Toggle confirm password visibility
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
          <button
            type="submit"
            disabled={loading} // Disable button when loading
            className="w-full flex justify-center items-center px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" /> // Show loader icon when loading
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" /> {/* Save icon */}
                Save Changes
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserProfile; // Exporting the component for use elsewhere
