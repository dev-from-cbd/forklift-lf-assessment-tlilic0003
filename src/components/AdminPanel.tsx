// Import React and specific hooks (useEffect and useState) from the React library
import React, { useEffect, useState } from 'react';

// Import custom hook useAuth from the AuthContext to access authentication data
import { useAuth } from '../contexts/AuthContext';

// Import the configured Supabase client instance for database operations
import { supabase } from '../config/supabase';

// Import icons from lucide-react library for UI enhancement
import { Users, Award, AlertCircle, Search, Loader2 } from 'lucide-react';

// Define the UserData interface to type-check the structure of user data
interface UserData {
  id: string;              // Unique identifier for the user
  email: string;           // User's email address
  created_at: string;      // Timestamp of when the user account was created
  progress: {              // Nested object containing user progress metrics
    total_questions: number;   // Total number of questions attempted
    correct_answers: number;   // Number of correctly answered questions
    completion_rate: number;   // Percentage of correct answers out of total
  };
}

// Define the AdminPanel component as a functional component using React.FC
const AdminPanel: React.FC = () => {
  // State to store the list of users with their data, initialized as an empty array
  const [users, setUsers] = useState<UserData[]>([]);

  // State to track loading status, initialized as true until data is fetched
  const [loading, setLoading] = useState(true);

  // State to store any error messages, initialized as an empty string
  const [error, setError] = useState('');

  // State to store the search term for filtering users, initialized as an empty string
  const [searchTerm, setSearchTerm] = useState('');

  // Destructure the user object from the useAuth hook to get the current authenticated user
  const { user } = useAuth();

  // useEffect hook to fetch user data when the component mounts or 'user' changes
  useEffect(() => {
    // Define an async function to fetch users and their progress data
    const fetchUsers = async () => {
      try {
        // Query the 'auth_users_view' table in Supabase to get all user data
        const { data: usersData, error: usersError } = await supabase
          .from('auth_users_view')
          .select('*');

        // Throw an error if the query fails
        if (usersError) throw usersError;

        // Map over each user to fetch their progress data and combine it with user data
        const usersWithProgress = await Promise.all(
          // Ensure usersData is an array (fallback to empty array if null)
          (usersData || []).map(async (userData) => {
            // Query the 'user_progress' table for progress data matching the user's ID
            const { data: progressData } = await supabase
              .from('user_progress')
              .select('*')
              .eq('user_id', userData.id);

            // Fallback to empty array if no progress data is returned
            const progress = progressData || [];

            // Calculate total questions attempted from progress data length
            const total_questions = progress.length;

            // Count correct answers by filtering progress where 'correct' is true
            const correct_answers = progress.filter(p => p.correct).length;

            // Calculate completion rate as a percentage, handling division by zero
            const completion_rate = total_questions > 0
              ? (correct_answers / total_questions) * 100
              : 0;

            // Return a new user object with combined user data and progress metrics
            return {
              ...userData,
              progress: {
                total_questions,
                correct_answers,
                completion_rate
              }
            };
          })
        );

        // Update the users state with the fetched and processed user data
        setUsers(usersWithProgress);
      } catch (err) {
        // Log any errors to the console for debugging
        console.error('Error fetching users:', err);

        // Set an error message to display to the user
        setError('Failed to fetch users data');
      } finally {
        // Set loading to false regardless of success or failure
        setLoading(false);
      }
    };

    // Call the fetchUsers function when the effect runs
    fetchUsers();
  }, [user]); // Dependency array includes 'user' to refetch if it changes

  // Filter users based on the search term, case-insensitive
  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Render a loading spinner while data is being fetched
  if (loading) {
    return (
      // Centered div with minimum height to contain the loading spinner
      <div className="flex items-center justify-center min-h-[400px]">
        // Animated Loader2 icon indicating data is being loaded
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Main render block when data is loaded
  return (
    // Container with auto margins and padding for layout
    <div className="container mx-auto px-4 py-8">
      // White background card with shadow and padding
      <div className="bg-white rounded-lg shadow-lg p-6">
        // Flex container for header and search bar
        <div className="flex items-center justify-between mb-6">
          // Left side: title and description
          <div>
            // Title with Users icon and bold styling
            <h1 className="text-2xl font-bold flex items-center">
              <Users className="w-6 h-6 mr-2" />
              Admin Panel
            </h1>
            // Subtitle text for context
            <p className="text-gray-600 mt-1">
              Manage users and track their progress
            </p>
          </div>
          // Right side: search input with icon
          <div className="relative">
            // Search input field with styling and event handler
            <input
              type="text"
              placeholder="Search users..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} // Update search term on input change
            />
            // Search icon positioned inside the input
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
        </div>

        // Display error message if one exists
        {error && (
          // Red alert box with icon and error text
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        // Table container with horizontal scrolling if needed
        <div className="overflow-x-auto">
          // Full-width table for user data
          <table className="w-full">
            // Table header with column titles
            <thead>
              <tr className="bg-gray-50">
                // Email column header
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                // Joined date column header
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                // Progress column header
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                // Completion rate column header
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completion
                </th>
              </tr>
            </thead>
            // Table body with user rows
            <tbody className="bg-white divide-y divide-gray-200">
              // Map over filtered users to create table rows
              {filteredUsers.map((userData) => (
                // Row for each user with hover effect
                <tr key={userData.id} className="hover:bg-gray-50">
                  // Email cell
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {userData.email}
                    </div>
                  </td>
                  // Joined date cell, formatted as local date string
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {new Date(userData.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  // Progress cell with icon and correct/total count
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Award className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-sm text-gray-900">
                        {userData.progress.correct_answers} / {userData.progress.total_questions}
                      </span>
                    </div>
                  </td>
                  // Completion rate cell with progress bar and percentage
                  <td className="px-6 py-4 whitespace-nowrap">
                    // Gray background for progress bar
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      // Blue fill representing completion rate
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${userData.progress.completion_rate}%` }}
                      ></div>
                    </div>
                    // Percentage text below the bar
                    <div className="text-xs text-gray-500 mt-1">
                      {userData.progress.completion_rate.toFixed(1)}%
                    </div>
                  </td>
                </tr>
              ))}
              // Display message if no users match the search
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Export the AdminPanel component as the default export
export default AdminPanel;