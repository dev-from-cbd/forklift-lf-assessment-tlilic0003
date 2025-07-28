// Import React library and hooks for state management and lifecycle methods
import React, { useEffect, useState } from 'react';
// Import custom authentication context hook for user authentication state
import { useAuth } from '../contexts/AuthContext';
// Import Supabase client configuration for database operations
import { supabase } from '../config/supabase';
// Import various icon components from Lucide React icon library
import { 
  Users,           // Icon for users/people
  Award,           // Icon for achievements/awards
  AlertCircle,     // Icon for alerts/warnings
  Search,          // Icon for search functionality
  Loader2,         // Icon for loading spinner
  UserCheck,       // Icon for verified/approved users
  UserX,           // Icon for removed/banned users
  Calendar,        // Icon for calendar/dates
  TrendingUp,      // Icon for upward trends/growth
  BarChart3,       // Icon for bar charts/analytics
  Settings,        // Icon for settings/configuration
  Database,        // Icon for database/data storage
  Shield,          // Icon for security/admin protection
  CheckCircle,     // Icon for success/completed status
  XCircle,         // Icon for error/failed status
  RefreshCw,       // Icon for refresh/reload action
  Bell             // Icon for notifications/alerts
} from 'lucide-react';
// Import AdminNotifications component for managing admin notifications
import AdminNotifications from './AdminNotifications';

// TypeScript interface defining the structure of user data
interface UserData {
  id: string;                           // Unique user identifier
  email: string;                        // User's email address
  created_at: string;                   // Account creation timestamp
  email_confirmed_at: string | null;    // Email confirmation timestamp (nullable)
  last_sign_in_at: string | null;       // Last login timestamp (nullable)
  progress: {                           // User's learning progress data
    total_questions: number;            // Total number of questions attempted
    correct_answers: number;            // Number of correct answers given
    completion_rate: number;            // Percentage completion rate
    last_activity: string | null;       // Last activity timestamp (nullable)
  };
  role: string;                         // User's role (admin/user)
}

// TypeScript interface defining the structure of admin statistics
interface AdminStats {
  totalUsers: number;                   // Total number of registered users
  activeUsers: number;                  // Number of recently active users
  completionRate: number;               // Average completion rate across all users
  newUsersThisWeek: number;            // Number of new users registered this week
}

// Main AdminPanel functional component definition
const AdminPanel: React.FC = () => {
  // State hook for storing array of user data
  const [users, setUsers] = useState<UserData[]>([]);
  // State hook for storing admin statistics with default values
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeUsers: 0,
    completionRate: 0,
    newUsersThisWeek: 0
  });
  // State hook for managing loading state during data fetching
  const [loading, setLoading] = useState(true);
  // State hook for storing error messages
  const [error, setError] = useState('');
  // State hook for managing search term input
  const [searchTerm, setSearchTerm] = useState('');
  // State hook for managing active tab selection with default 'overview'
  const [selectedTab, setSelectedTab] = useState<'overview' | 'users' | 'content' | 'settings' | 'notifications'>('overview');
  // State hook for tracking database connection status
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  // Destructure user object from authentication context
  const { user } = useAuth();

  // Effect hook that runs when component mounts or user changes
  useEffect(() => {
    fetchAdminData(); // Call function to fetch admin data
  }, [user]); // Dependency array - re-run when user changes

  // Async function to fetch all admin data with error handling
  const fetchAdminData = async () => {
    try {
      setLoading(true);                    // Set loading state to true
      setError('');                        // Clear any previous errors
      setConnectionStatus('checking');     // Set connection status to checking
      
      // Create a timeout promise that rejects after 10 seconds
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Operation timeout')), 10000)
      );

      // Create promise for actual data fetching
      const dataPromise = fetchDataWithFallback();
      
      // Race between data fetching and timeout - whichever completes first
      await Promise.race([dataPromise, timeoutPromise]);
      setConnectionStatus('connected');    // Set status to connected on success
      
    } catch (err) {
      console.error('Error fetching admin data:', err); // Log error to console
      setConnectionStatus('error');        // Set connection status to error
      
      // Check if error is due to timeout
      if (err instanceof Error && err.message === 'Operation timeout') {
        setError('Connection timeout. Database may be unavailable.');
      } else {
        setError('Failed to fetch admin data. Using fallback data.');
      }
      
      // Set fallback data when real data fetch fails
      setFallbackData();
    } finally {
      setLoading(false);                   // Always set loading to false when done
    }
  };

  // Async function to fetch data with fallback mechanism
  const fetchDataWithFallback = async () => {
    try {
      // Test basic database connection first by querying user_roles table
      const { error: connectionError } = await supabase
        .from('user_roles')
        .select('count', { count: 'exact', head: true });

      // If connection test fails, throw error
      if (connectionError) {
        throw new Error(`Database connection failed: ${connectionError.message}`);
      }

      // Create promise to fetch user progress data
      const progressPromise = supabase
        .from('user_progress')
        .select(`
          user_id,
          correct,
          last_attempt_at,
          question_id
        `);

      // Create promise to fetch user roles data
      const rolesPromise = supabase
        .from('user_roles')
        .select('user_id, role');

      // Execute both queries concurrently and wait for both to settle
      const [progressResult, rolesResult] = await Promise.allSettled([
        progressPromise,
        rolesPromise
      ]);

      // Extract data from results, defaulting to empty array if failed
      const progressData = progressResult.status === 'fulfilled' ? progressResult.value.data : [];
      const rolesData = rolesResult.status === 'fulfilled' ? rolesResult.value.data : [];

      // Create a Map to store user data efficiently
      const userMap = new Map();
      
      // Add current authenticated user to the map if exists
      if (user) {
        userMap.set(user.id, {
          id: user.id,
          email: user.email || 'Unknown',
          created_at: user.created_at || new Date().toISOString(),
          email_confirmed_at: user.email_confirmed_at,
          last_sign_in_at: user.last_sign_in_at,
          progress: {
            total_questions: 0,
            correct_answers: 0,
            completion_rate: 0,
            last_activity: null
          },
          // Set role to admin if email matches specific admin email, otherwise user
          role: user.email === 'neoguru@gmail.com' ? 'admin' : 'user'
        });
      }

      // Process progress data and build user records
      progressData?.forEach(record => {
        const userId = record.user_id;
        // If user doesn't exist in map, create new user record
        if (!userMap.has(userId)) {
          userMap.set(userId, {
            id: userId,
            email: `user-${userId.slice(0, 8)}@example.com`, // Generate placeholder email
            created_at: new Date().toISOString(),
            email_confirmed_at: new Date().toISOString(),
            last_sign_in_at: record.last_attempt_at,
            progress: {
              total_questions: 0,
              correct_answers: 0,
              completion_rate: 0,
              last_activity: record.last_attempt_at
            },
            role: 'user'
          });
        }
        
        // Get existing user data from map
        const userData = userMap.get(userId);
        userData.progress.total_questions++;              // Increment total questions count
        if (record.correct) userData.progress.correct_answers++; // Increment correct answers if answer was correct
        
        // Update last activity if this record is more recent
        if (!userData.progress.last_activity || 
            new Date(record.last_attempt_at) > new Date(userData.progress.last_activity)) {
          userData.progress.last_activity = record.last_attempt_at;
        }
      });

      // Apply role data to existing users in the map
      rolesData?.forEach(roleRecord => {
        if (userMap.has(roleRecord.user_id)) {
          userMap.get(roleRecord.user_id).role = roleRecord.role;
        }
      });

      // Calculate completion rates for all users
      userMap.forEach(userData => {
        userData.progress.completion_rate = userData.progress.total_questions > 0
          ? (userData.progress.correct_answers / userData.progress.total_questions) * 100
          : 0;
      });

      // Convert Map to array and update state
      const usersArray = Array.from(userMap.values());
      setUsers(usersArray);

      // Calculate and set statistics based on users data
      calculateStats(usersArray);

    } catch (error) {
      console.error('Data fetch error:', error); // Log any errors
      throw error; // Re-throw error to be handled by calling function
    }
  };

  // Function to set fallback data when database is unavailable
  const setFallbackData = () => {
    // Create fallback user data array with current user if authenticated
    const fallbackUsers: UserData[] = user ? [{
      id: user.id,
      email: user.email || 'neoguru@gmail.com',
      created_at: user.created_at || new Date().toISOString(),
      email_confirmed_at: user.email_confirmed_at,
      last_sign_in_at: user.last_sign_in_at,
      progress: {
        total_questions: 72,    // Hardcoded fallback values
        correct_answers: 65,
        completion_rate: 90.3,
        last_activity: new Date().toISOString()
      },
      role: 'admin'
    }] : [];

    // Set fallback users and stats
    setUsers(fallbackUsers);
    setStats({
      totalUsers: fallbackUsers.length,
      activeUsers: fallbackUsers.length,
      completionRate: 90.3,
      newUsersThisWeek: 0
    });
  };

  // Function to calculate statistics from users array
  const calculateStats = (usersArray: UserData[]) => {
    const totalUsers = usersArray.length;                    // Count total users
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // Calculate date one week ago
    
    // Count users who signed in within the last week
    const activeUsers = usersArray.filter(u => 
      u.last_sign_in_at && 
      new Date(u.last_sign_in_at) > weekAgo
    ).length;
    
    // Calculate average completion rate across all users
    const avgCompletion = usersArray.length > 0
      ? usersArray.reduce((sum, u) => sum + u.progress.completion_rate, 0) / usersArray.length
      : 0;

    // Count users created within the last week
    const newUsersThisWeek = usersArray.filter(u => 
      new Date(u.created_at) > weekAgo
    ).length;

    // Update stats state with calculated values
    setStats({
      totalUsers,
      activeUsers,
      completionRate: avgCompletion,
      newUsersThisWeek
    });
  };

  // Filter users based on search term (case-insensitive email search)
  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Async function to toggle user role between admin and user
  const toggleUserRole = async (userId: string, currentRole: string) => {
    try {
      // Determine new role (toggle between admin and user)
      const newRole = currentRole === 'admin' ? 'user' : 'admin';
      
      // Update role in database using upsert (insert or update)
      const { error } = await supabase
        .from('user_roles')
        .upsert({ user_id: userId, role: newRole }, { onConflict: 'user_id' });

      if (error) throw error; // Throw error if database operation fails

      // Update local state to reflect role change
      setUsers(users.map(u => 
        u.id === userId ? { ...u, role: newRole } : u
      ));
    } catch (err) {
      console.error('Error updating user role:', err); // Log error
      setError('Failed to update user role');          // Set error message
    }
  };

  // Render loading state if data is still being fetched
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading admin panel...</p>
              <p className="text-sm text-gray-500 mt-2">This may take a few seconds</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main component render
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg">
        {/* Header section with title and status indicators */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center">
                <Shield className="w-6 h-6 mr-2 text-purple-600" />
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Manage users, content, and system settings
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {/* Connection status indicator with dynamic styling */}
              <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                connectionStatus === 'connected' ? 'bg-green-100 text-green-800' :
                connectionStatus === 'error' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {/* Conditional icon rendering based on connection status */}
                {connectionStatus === 'connected' && <CheckCircle className="w-4 h-4 mr-1" />}
                {connectionStatus === 'error' && <XCircle className="w-4 h-4 mr-1" />}
                {connectionStatus === 'checking' && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}
                {/* Conditional text based on connection status */}
                {connectionStatus === 'connected' ? 'Connected' : 
                 connectionStatus === 'error' ? 'Database Error' : 'Checking...'}
              </div>
              {/* Administrator role badge (duplicate - likely a bug) */}
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                Administrator
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                Administrator
              </span>
            </div>
          </div>
        </div>

        {/* Navigation tabs section */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {/* Array of tab configurations */}
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'content', label: 'Content', icon: Database },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map(tab => {
              const Icon = tab.icon; // Extract icon component
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id as any)} // Set active tab on click
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                    selectedTab === tab.id
                      ? 'border-purple-500 text-purple-600'      // Active tab styling
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300' // Inactive tab styling
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Error message display with retry button */}
        {error && (
          <div className="mx-6 mt-4 p-4 bg-yellow-100 text-yellow-700 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            <div className="flex-1">
              {error}
            </div>
            <button
              onClick={fetchAdminData} // Retry data fetching on click
              className="ml-4 px-3 py-1 bg-yellow-200 hover:bg-yellow-300 rounded text-sm flex items-center"
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Retry
            </button>
          </div>
        )}

        {/* Tab content section with conditional rendering */}
        <div className="p-6">
          {/* Overview tab content */}
          {selectedTab === 'overview' && (
            <div className="space-y-6">
              {/* Statistics cards grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Users card */}
                <div className="bg-blue-50 p-6 rounded-lg">
                  <div className="flex items-center">
                    <Users className="w-8 h-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-blue-600">Total Users</p>
                      <p className="text-2xl font-bold text-blue-900">{stats.totalUsers}</p>
                    </div>
                  </div>
                </div>

                {/* Active Users card */}
                <div className="bg-green-50 p-6 rounded-lg">
                  <div className="flex items-center">
                    <UserCheck className="w-8 h-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-green-600">Active Users</p>
                      <p className="text-2xl font-bold text-green-900">{stats.activeUsers}</p>
                    </div>
                  </div>
                </div>

                {/* Average Completion card */}
                <div className="bg-purple-50 p-6 rounded-lg">
                  <div className="flex items-center">
                    <TrendingUp className="w-8 h-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-purple-600">Avg. Completion</p>
                      <p className="text-2xl font-bold text-purple-900">
                        {stats.completionRate.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* New Users This Week card */}
                <div className="bg-orange-50 p-6 rounded-lg">
                  <div className="flex items-center">
                    <Calendar className="w-8 h-8 text-orange-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-orange-600">New This Week</p>
                      <p className="text-2xl font-bold text-orange-900">{stats.newUsersThisWeek}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* System Status section */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">System Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Database status indicator */}
                  <div className="flex items-center">
                    {connectionStatus === 'connected' ? (
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500 mr-2" />
                    )}
                    <span className="text-sm">
                      Database {connectionStatus === 'connected' ? 'Connected' : 'Disconnected'}
                    </span>
                  </div>
                  {/* Authentication status (always active) */}
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-sm">Authentication Active</span>
                  </div>
                  {/* Admin panel status (always operational) */}
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-sm">Admin Panel Operational</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Users tab content */}
          {selectedTab === 'users' && (
            <div className="space-y-6">
              {/* Search input field */}
              <div className="relative max-w-md">
                <input
                  type="text"
                  placeholder="Search users..."
                  className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)} // Update search term on input change
                />
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>

              {/* Users table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  {/* Table header */}
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Progress
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Activity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  {/* Table body */}
                  <tbody className="bg-white divide-y divide-gray-200">
                    {/* Map through filtered users to create table rows */}
                    {filteredUsers.map((userData) => (
                      <tr key={userData.id} className="hover:bg-gray-50">
                        {/* User information cell */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {/* User avatar placeholder */}
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                              <Users className="w-5 h-5 text-gray-600" />
                            </div>
                            <div className="ml-4">
                              {/* User email */}
                              <div className="text-sm font-medium text-gray-900">
                                {userData.email}
                              </div>
                              {/* Truncated user ID */}
                              <div className="text-sm text-gray-500">
                                ID: {userData.id.slice(0, 8)}...
                              </div>
                            </div>
                          </div>
                        </td>
                        {/* User role cell with colored badge */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            userData.role === 'admin'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {userData.role}
                          </span>
                        </td>
                        {/* User progress cell with progress bar */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Award className="w-4 h-4 text-green-500 mr-2" />
                            {/* Progress text */}
                            <span className="text-sm text-gray-900">
                              {userData.progress.correct_answers} / {userData.progress.total_questions}
                            </span>
                            {/* Progress bar */}
                            <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${Math.min(userData.progress.completion_rate, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        {/* Last activity cell */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {userData.progress.last_activity
                            ? new Date(userData.progress.last_activity).toLocaleDateString()
                            : 'Never'
                          }
                        </td>
                        {/* Actions cell with role toggle button */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {/* Only show role toggle button if not current user */}
                          {userData.email !== user?.email && (
                            <button
                              onClick={() => toggleUserRole(userData.id, userData.role)}
                              className={`inline-flex items-center px-3 py-1 rounded-md text-sm ${
                                userData.role === 'admin'
                                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                  : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                              }`}
                            >
                              {/* Conditional button content based on current role */}
                              {userData.role === 'admin' ? (
                                <>
                                  <UserX className="w-4 h-4 mr-1" />
                                  Remove Admin
                                </>
                              ) : (
                                <>
                                  <UserCheck className="w-4 h-4 mr-1" />
                                  Make Admin
                                </>
                              )}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {/* Empty state row when no users found */}
                    {filteredUsers.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                          No users found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Notifications tab content - renders AdminNotifications component */}
          {selectedTab === 'notifications' && (
            <AdminNotifications />
          )}

          {/* Content tab content */}
          {selectedTab === 'content' && (
            <div className="space-y-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Content Management</h3>
                <p className="text-blue-700 mb-4">
                  Manage questions, exercises, and course content.
                </p>
                {/* Content management cards grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Questions Database card */}
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Questions Database</h4>
                    <p className="text-sm text-gray-600 mb-3">View and manage quiz questions</p>
                    <div className="text-2xl font-bold text-blue-600 mb-2">72</div>
                    <p className="text-xs text-gray-500">Total Questions</p>
                  </div>
                  {/* User Progress card */}
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-medium mb-2">User Progress</h4>
                    <p className="text-sm text-gray-600 mb-3">Track completion rates</p>
                    <div className="text-2xl font-bold text-green-600 mb-2">{stats.completionRate.toFixed(0)}%</div>
                    <p className="text-xs text-gray-500">Average Completion</p>
                  </div>
                  {/* System Health card */}
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-medium mb-2">System Health</h4>
                    <p className="text-sm text-gray-600 mb-3">Monitor system status</p>
                    <div className="flex items-center">
                      {/* Conditional system health indicator */}
                      {connectionStatus === 'connected' ? (
                        <>
                          <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
                          <span className="text-sm font-medium text-green-600">Operational</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-6 h-6 text-red-500 mr-2" />
                          <span className="text-sm font-medium text-red-600">Issues Detected</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Settings tab content */}
          {selectedTab === 'settings' && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">System Settings</h3>
                <div className="space-y-4">
                  {/* User Registration setting */}
                  <div className="flex items-center justify-between py-3 border-b">
                    <div>
                      <h4 className="font-medium">User Registration</h4>
                      <p className="text-sm text-gray-600">Allow new user registrations</p>
                    </div>
                    <span className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm">
                      Enabled
                    </span>
                  </div>
                  {/* Admin Panel setting */}
                  <div className="flex items-center justify-between py-3 border-b">
                    <div>
                      <h4 className="font-medium">Admin Panel</h4>
                      <p className="text-sm text-gray-600">Administrative interface status</p>
                    </div>
                    <span className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm">
                      Active
                    </span>
                  </div>
                  {/* Database Connection setting */}
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <h4 className="font-medium">Database Connection</h4>
                      <p className="text-sm text-gray-600">Supabase database status</p>
                    </div>
                    {/* Dynamic status badge based on connection status */}
                    <span className={`px-4 py-2 rounded-lg text-sm ${
                      connectionStatus === 'connected' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-red-500 text-white'
                    }`}>
                      {connectionStatus === 'connected' ? 'Connected' : 'Disconnected'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Export AdminPanel component as default export
export default AdminPanel;import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../config/supabase';
import { 
  Users, 
  Award, 
  AlertCircle, 
  Search, 
  Loader2, 
  UserCheck, 
  UserX, 
  Calendar,
  TrendingUp,
  BarChart3,
  Settings,
  Database,
  Shield,
  CheckCircle,
  XCircle,
  RefreshCw,
  Bell
} from 'lucide-react';
import AdminNotifications from './AdminNotifications';

interface UserData {
  id: string;
  email: string;
  created_at: string;
  email_confirmed_at: string | null;
  last_sign_in_at: string | null;
  progress: {
    total_questions: number;
    correct_answers: number;
    completion_rate: number;
    last_activity: string | null;
  };
  role: string;
}

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  completionRate: number;
  newUsersThisWeek: number;
}

const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeUsers: 0,
    completionRate: 0,
    newUsersThisWeek: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState<'overview' | 'users' | 'content' | 'settings' | 'notifications'>('overview');
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const { user } = useAuth();

  useEffect(() => {
    fetchAdminData();
  }, [user]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      setError('');
      setConnectionStatus('checking');
      
      // Set timeout for the entire operation
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Operation timeout')), 10000)
      );

      const dataPromise = fetchDataWithFallback();
      
      await Promise.race([dataPromise, timeoutPromise]);
      setConnectionStatus('connected');
      
    } catch (err) {
      console.error('Error fetching admin data:', err);
      setConnectionStatus('error');
      
      if (err instanceof Error && err.message === 'Operation timeout') {
        setError('Connection timeout. Database may be unavailable.');
      } else {
        setError('Failed to fetch admin data. Using fallback data.');
      }
      
      // Set fallback data
      setFallbackData();
    } finally {
      setLoading(false);
    }
  };

  const fetchDataWithFallback = async () => {
    try {
      // Test basic connection first
      const { error: connectionError } = await supabase
        .from('user_roles')
        .select('count', { count: 'exact', head: true });

      if (connectionError) {
        throw new Error(`Database connection failed: ${connectionError.message}`);
      }

      // Get user progress data with timeout
      const progressPromise = supabase
        .from('user_progress')
        .select(`
          user_id,
          correct,
          last_attempt_at,
          question_id
        `);

      const rolesPromise = supabase
        .from('user_roles')
        .select('user_id, role');

      const [progressResult, rolesResult] = await Promise.allSettled([
        progressPromise,
        rolesPromise
      ]);

      const progressData = progressResult.status === 'fulfilled' ? progressResult.value.data : [];
      const rolesData = rolesResult.status === 'fulfilled' ? rolesResult.value.data : [];

      // Process data
      const userMap = new Map();
      
      // Add current user if authenticated
      if (user) {
        userMap.set(user.id, {
          id: user.id,
          email: user.email || 'Unknown',
          created_at: user.created_at || new Date().toISOString(),
          email_confirmed_at: user.email_confirmed_at,
          last_sign_in_at: user.last_sign_in_at,
          progress: {
            total_questions: 0,
            correct_answers: 0,
            completion_rate: 0,
            last_activity: null
          },
          role: user.email === 'neoguru@gmail.com' ? 'admin' : 'user'
        });
      }

      // Process progress data
      progressData?.forEach(record => {
        const userId = record.user_id;
        if (!userMap.has(userId)) {
          userMap.set(userId, {
            id: userId,
            email: `user-${userId.slice(0, 8)}@example.com`,
            created_at: new Date().toISOString(),
            email_confirmed_at: new Date().toISOString(),
            last_sign_in_at: record.last_attempt_at,
            progress: {
              total_questions: 0,
              correct_answers: 0,
              completion_rate: 0,
              last_activity: record.last_attempt_at
            },
            role: 'user'
          });
        }
        
        const userData = userMap.get(userId);
        userData.progress.total_questions++;
        if (record.correct) userData.progress.correct_answers++;
        
        if (!userData.progress.last_activity || 
            new Date(record.last_attempt_at) > new Date(userData.progress.last_activity)) {
          userData.progress.last_activity = record.last_attempt_at;
        }
      });

      // Apply roles
      rolesData?.forEach(roleRecord => {
        if (userMap.has(roleRecord.user_id)) {
          userMap.get(roleRecord.user_id).role = roleRecord.role;
        }
      });

      // Calculate completion rates
      userMap.forEach(userData => {
        userData.progress.completion_rate = userData.progress.total_questions > 0
          ? (userData.progress.correct_answers / userData.progress.total_questions) * 100
          : 0;
      });

      const usersArray = Array.from(userMap.values());
      setUsers(usersArray);

      // Calculate stats
      calculateStats(usersArray);

    } catch (error) {
      console.error('Data fetch error:', error);
      throw error;
    }
  };

  const setFallbackData = () => {
    // Create fallback data when database is unavailable
    const fallbackUsers: UserData[] = user ? [{
      id: user.id,
      email: user.email || 'neoguru@gmail.com',
      created_at: user.created_at || new Date().toISOString(),
      email_confirmed_at: user.email_confirmed_at,
      last_sign_in_at: user.last_sign_in_at,
      progress: {
        total_questions: 72,
        correct_answers: 65,
        completion_rate: 90.3,
        last_activity: new Date().toISOString()
      },
      role: 'admin'
    }] : [];

    setUsers(fallbackUsers);
    setStats({
      totalUsers: fallbackUsers.length,
      activeUsers: fallbackUsers.length,
      completionRate: 90.3,
      newUsersThisWeek: 0
    });
  };

  const calculateStats = (usersArray: UserData[]) => {
    const totalUsers = usersArray.length;
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    const activeUsers = usersArray.filter(u => 
      u.last_sign_in_at && 
      new Date(u.last_sign_in_at) > weekAgo
    ).length;
    
    const avgCompletion = usersArray.length > 0
      ? usersArray.reduce((sum, u) => sum + u.progress.completion_rate, 0) / usersArray.length
      : 0;

    const newUsersThisWeek = usersArray.filter(u => 
      new Date(u.created_at) > weekAgo
    ).length;

    setStats({
      totalUsers,
      activeUsers,
      completionRate: avgCompletion,
      newUsersThisWeek
    });
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleUserRole = async (userId: string, currentRole: string) => {
    try {
      const newRole = currentRole === 'admin' ? 'user' : 'admin';
      
      const { error } = await supabase
        .from('user_roles')
        .upsert({ user_id: userId, role: newRole }, { onConflict: 'user_id' });

      if (error) throw error;

      setUsers(users.map(u => 
        u.id === userId ? { ...u, role: newRole } : u
      ));
    } catch (err) {
      console.error('Error updating user role:', err);
      setError('Failed to update user role');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading admin panel...</p>
              <p className="text-sm text-gray-500 mt-2">This may take a few seconds</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center">
                <Shield className="w-6 h-6 mr-2 text-purple-600" />
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Manage users, content, and system settings
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                connectionStatus === 'connected' ? 'bg-green-100 text-green-800' :
                connectionStatus === 'error' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {connectionStatus === 'connected' && <CheckCircle className="w-4 h-4 mr-1" />}
                {connectionStatus === 'error' && <XCircle className="w-4 h-4 mr-1" />}
                {connectionStatus === 'checking' && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}
                {connectionStatus === 'connected' ? 'Connected' : 
                 connectionStatus === 'error' ? 'Database Error' : 'Checking...'}
              </div>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                Administrator
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                Administrator
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'content', label: 'Content', icon: Database },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                    selectedTab === tab.id
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-4 bg-yellow-100 text-yellow-700 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            <div className="flex-1">
              {error}
            </div>
            <button
              onClick={fetchAdminData}
              className="ml-4 px-3 py-1 bg-yellow-200 hover:bg-yellow-300 rounded text-sm flex items-center"
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Retry
            </button>
          </div>
        )}

        {/* Tab Content */}
        <div className="p-6">
          {selectedTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <div className="flex items-center">
                    <Users className="w-8 h-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-blue-600">Total Users</p>
                      <p className="text-2xl font-bold text-blue-900">{stats.totalUsers}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-6 rounded-lg">
                  <div className="flex items-center">
                    <UserCheck className="w-8 h-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-green-600">Active Users</p>
                      <p className="text-2xl font-bold text-green-900">{stats.activeUsers}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 p-6 rounded-lg">
                  <div className="flex items-center">
                    <TrendingUp className="w-8 h-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-purple-600">Avg. Completion</p>
                      <p className="text-2xl font-bold text-purple-900">
                        {stats.completionRate.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 p-6 rounded-lg">
                  <div className="flex items-center">
                    <Calendar className="w-8 h-8 text-orange-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-orange-600">New This Week</p>
                      <p className="text-2xl font-bold text-orange-900">{stats.newUsersThisWeek}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* System Status */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">System Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center">
                    {connectionStatus === 'connected' ? (
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500 mr-2" />
                    )}
                    <span className="text-sm">
                      Database {connectionStatus === 'connected' ? 'Connected' : 'Disconnected'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-sm">Authentication Active</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-sm">Admin Panel Operational</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'users' && (
            <div className="space-y-6">
              {/* Search */}
              <div className="relative max-w-md">
                <input
                  type="text"
                  placeholder="Search users..."
                  className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>

              {/* Users Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Progress
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Activity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((userData) => (
                      <tr key={userData.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                              <Users className="w-5 h-5 text-gray-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {userData.email}
                              </div>
                              <div className="text-sm text-gray-500">
                                ID: {userData.id.slice(0, 8)}...
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            userData.role === 'admin'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {userData.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Award className="w-4 h-4 text-green-500 mr-2" />
                            <span className="text-sm text-gray-900">
                              {userData.progress.correct_answers} / {userData.progress.total_questions}
                            </span>
                            <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${Math.min(userData.progress.completion_rate, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {userData.progress.last_activity
                            ? new Date(userData.progress.last_activity).toLocaleDateString()
                            : 'Never'
                          }
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {userData.email !== user?.email && (
                            <button
                              onClick={() => toggleUserRole(userData.id, userData.role)}
                              className={`inline-flex items-center px-3 py-1 rounded-md text-sm ${
                                userData.role === 'admin'
                                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                  : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                              }`}
                            >
                              {userData.role === 'admin' ? (
                                <>
                                  <UserX className="w-4 h-4 mr-1" />
                                  Remove Admin
                                </>
                              ) : (
                                <>
                                  <UserCheck className="w-4 h-4 mr-1" />
                                  Make Admin
                                </>
                              )}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {filteredUsers.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                          No users found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {selectedTab === 'notifications' && (
            <AdminNotifications />
          )}

          {selectedTab === 'content' && (
            <div className="space-y-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Content Management</h3>
                <p className="text-blue-700 mb-4">
                  Manage questions, exercises, and course content.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Questions Database</h4>
                    <p className="text-sm text-gray-600 mb-3">View and manage quiz questions</p>
                    <div className="text-2xl font-bold text-blue-600 mb-2">72</div>
                    <p className="text-xs text-gray-500">Total Questions</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-medium mb-2">User Progress</h4>
                    <p className="text-sm text-gray-600 mb-3">Track completion rates</p>
                    <div className="text-2xl font-bold text-green-600 mb-2">{stats.completionRate.toFixed(0)}%</div>
                    <p className="text-xs text-gray-500">Average Completion</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-medium mb-2">System Health</h4>
                    <p className="text-sm text-gray-600 mb-3">Monitor system status</p>
                    <div className="flex items-center">
                      {connectionStatus === 'connected' ? (
                        <>
                          <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
                          <span className="text-sm font-medium text-green-600">Operational</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-6 h-6 text-red-500 mr-2" />
                          <span className="text-sm font-medium text-red-600">Issues Detected</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'settings' && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">System Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b">
                    <div>
                      <h4 className="font-medium">User Registration</h4>
                      <p className="text-sm text-gray-600">Allow new user registrations</p>
                    </div>
                    <span className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm">
                      Enabled
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b">
                    <div>
                      <h4 className="font-medium">Admin Panel</h4>
                      <p className="text-sm text-gray-600">Administrative interface status</p>
                    </div>
                    <span className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm">
                      Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <h4 className="font-medium">Database Connection</h4>
                      <p className="text-sm text-gray-600">Supabase database status</p>
                    </div>
                    <span className={`px-4 py-2 rounded-lg text-sm ${
                      connectionStatus === 'connected' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-red-500 text-white'
                    }`}>
                      {connectionStatus === 'connected' ? 'Connected' : 'Disconnected'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;