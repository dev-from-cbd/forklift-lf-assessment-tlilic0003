// Import necessary React hooks and components
import React, { useEffect, useState } from 'react';
// Import authentication context hook
import { useAuth } from '../contexts/AuthContext';
// Import Supabase client configuration
import { supabase } from '../config/supabase';
// Import Lucide icons for UI elements
import { Users, Award, AlertCircle, Search, Loader2 } from 'lucide-react';

// Define interface for user data structure
interface UserData {
  id: string;                // Unique identifier for the user
  email: string;             // User's email address
  created_at: string;        // Timestamp when user account was created
  progress: {                // Nested object containing user progress information
    total_questions: number; // Total number of questions attempted by user
    correct_answers: number; // Number of questions answered correctly
    completion_rate: number; // Percentage of completion (correct answers / total questions)
  };
}

// Define AdminPanel component as a functional component
const AdminPanel: React.FC = () => {
  // State for storing users data
  const [users, setUsers] = useState<UserData[]>([]);
  // State for tracking loading status
  const [loading, setLoading] = useState(true);
  // State for storing error messages
  const [error, setError] = useState('');
  // State for storing search term for filtering users
  const [searchTerm, setSearchTerm] = useState('');
  // Get current authenticated user from auth context
  const { user } = useAuth();

  // Effect hook to fetch users data when component mounts
  useEffect(() => {
    // Define async function to fetch users data
    const fetchUsers = async () => {
      try {
        // Fetch all users from auth_users_view table
        const { data: usersData, error: usersError } = await supabase
          .from('auth_users_view')
          .select('*');

        // If there's an error fetching users, throw it
        if (usersError) throw usersError;

        // Fetch progress data for each user using Promise.all for parallel execution
        const usersWithProgress = await Promise.all(
          (usersData || []).map(async (userData) => {
            // Query user_progress table for each user
            const { data: progressData } = await supabase
              .from('user_progress')
              .select('*')
              .eq('user_id', userData.id);

            // Process progress data to calculate statistics
            const progress = progressData || [];
            const total_questions = progress.length;
            const correct_answers = progress.filter(p => p.correct).length;
            // Calculate completion rate as percentage, avoid division by zero
            const completion_rate = total_questions > 0
              ? (correct_answers / total_questions) * 100
              : 0;

            // Return user data with added progress information
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

        // Update users state with fetched and processed data
        setUsers(usersWithProgress);
      } catch (err) {
        // Log error to console for debugging
        console.error('Error fetching users:', err);
        // Set user-friendly error message
        setError('Failed to fetch users data');
      } finally {
        // Set loading to false regardless of success or failure
        setLoading(false);
      }
    };

    // Call the fetch function
    fetchUsers();
  }, [user]); // Dependency array - re-run when user changes

  // Filter users based on search term (case insensitive)
  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show loading spinner while data is being fetched
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Render admin panel UI
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              <Users className="w-6 h-6 mr-2" />
              Admin Panel
            </h1>
            <p className="text-gray-600 mt-1">
              Manage users and track their progress
            </p>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
        </div>

        {/* Display error message if there is one */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completion
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Map through filtered users and render a row for each */}
              {filteredUsers.map((userData) => (
                <tr key={userData.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {userData.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {new Date(userData.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Award className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-sm text-gray-900">
                        {userData.progress.correct_answers} / {userData.progress.total_questions}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${userData.progress.completion_rate}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {userData.progress.completion_rate.toFixed(1)}%
                    </div>
                  </td>
                </tr>
              ))}
              {/* Show message when no users match the search criteria */}
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

// Export the AdminPanel component as default
export default AdminPanel;