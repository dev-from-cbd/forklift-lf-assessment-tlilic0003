// Import React core functionality for component creation and state management
import React, { useEffect, useState } from 'react';
// Import authentication context hook for user authentication
import { useAuth } from '../contexts/AuthContext';
// Import Supabase client for database operations
import { supabase } from '../config/supabase';
// Import various icons from Lucide React icon library
import { 
  Users,        // Icon for users/people
  Award,        // Icon for achievements/awards
  AlertCircle,  // Icon for alerts/warnings
  Search,       // Icon for search functionality
  Loader2,      // Icon for loading spinner
  UserCheck,    // Icon for verified/approved users
  UserX,        // Icon for removed/banned users
  Calendar,     // Icon for calendar/dates
  TrendingUp,   // Icon for upward trends/growth
  BarChart3,    // Icon for charts/analytics
  Settings,     // Icon for settings/configuration
  Database,     // Icon for database/storage
  Shield,       // Icon for security/admin protection
  CheckCircle,  // Icon for success/completed status
  XCircle,      // Icon for error/failed status
  RefreshCw,    // Icon for refresh/reload action
  Bell          // Icon for notifications
} from 'lucide-react';
// Import AdminNotifications component for notification management
import AdminNotifications from './AdminNotifications';

// Interface defining the structure of user data
interface UserData {
  id: string;                           // Unique user identifier
  email: string;                        // User's email address
  created_at: string;                   // Account creation timestamp
  email_confirmed_at: string | null;    // Email confirmation timestamp (nullable)
  last_sign_in_at: string | null;       // Last login timestamp (nullable)
  progress: {                           // User's learning progress data
    total_questions: number;            // Total number of questions attempted
    correct_answers: number;            // Number of correct answers
    completion_rate: number;            // Percentage completion rate
    last_activity: string | null;       // Last activity timestamp (nullable)
  };
  role: string;                         // User's role (admin/user)
}

// Interface defining the structure of admin statistics
interface AdminStats {
  totalUsers: number;                   // Total number of registered users
  activeUsers: number;                  // Number of recently active users
  completionRate: number;               // Average completion rate across all users
  newUsersThisWeek: number;             // Number of new users registered this week
}

// AdminPanel functional component definition
const AdminPanel: React.FC = () => {
  // State for storing array of user data
  const [users, setUsers] = useState<UserData[]>([]);
  // State for storing admin dashboard statistics
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,                      // Initialize total users count to 0
    activeUsers: 0,                     // Initialize active users count to 0
    completionRate: 0,                  // Initialize completion rate to 0%
    newUsersThisWeek: 0                 // Initialize new users this week to 0
  });
  // State for managing loading status during data fetching
  const [loading, setLoading] = useState(true);
  // State for storing error messages
  const [error, setError] = useState('');
  // State for storing user search input
  const [searchTerm, setSearchTerm] = useState('');
  // State for managing which tab is currently selected in the admin panel
  const [selectedTab, setSelectedTab] = useState<'overview' | 'users' | 'content' | 'settings' | 'notifications'>('overview');
  // State for tracking database connection status
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  // Extract current authenticated user from auth context
  const { user } = useAuth();

  // useEffect hook to fetch admin data when component mounts or user changes
  useEffect(() => {
    fetchAdminData();                   // Call function to fetch admin data
  }, [user]);                           // Dependency array - re-run when user changes

  // Async function to fetch admin data with error handling and timeout
  const fetchAdminData = async () => {
    try {
      setLoading(true);                 // Set loading state to true
      setError('');                     // Clear any previous errors
      setConnectionStatus('checking');  // Set connection status to checking
      
      // Set timeout for the entire operation (10 seconds)
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Operation timeout')), 10000)
      );

      // Create promise for data fetching
      const dataPromise = fetchDataWithFallback();
      
      // Race between data fetching and timeout
      await Promise.race([dataPromise, timeoutPromise]);
      setConnectionStatus('connected'); // Set status to connected on success
      
    } catch (err) {
      console.error('Error fetching admin data:', err);  // Log error to console
      setConnectionStatus('error');                      // Set connection status to error
      
      // Check if error is due to timeout
      if (err instanceof Error && err.message === 'Operation timeout') {
        setError('Connection timeout. Database may be unavailable.');
      } else {
        setError('Failed to fetch admin data. Using fallback data.');
      }
      
      // Set fallback data when database is unavailable
      setFallbackData();
    } finally {
      setLoading(false);                // Always set loading to false when done
    }
  };

  // Function to fetch data from database with fallback handling
  const fetchDataWithFallback = async () => {
    try {
      // Test basic connection first by checking user_roles table
      const { error: connectionError } = await supabase
        .from('user_roles')                                    // Query user_roles table
        .select('count', { count: 'exact', head: true });      // Get count only (no data)

      // If connection test fails, throw error
      if (connectionError) {
        throw new Error(`Database connection failed: ${connectionError.message}`);
      }

      // Get user progress data with timeout - create promise for progress data
      const progressPromise = supabase
        .from('user_progress')                                 // Query user_progress table
        .select(`
          user_id,                                             // User identifier
          correct,                                             // Whether answer was correct
          last_attempt_at,                                     // Timestamp of last attempt
          question_id                                          // Question identifier
        `);

      // Create promise for user roles data
      const rolesPromise = supabase
        .from('user_roles')                                    // Query user_roles table
        .select('user_id, role');                              // Get user ID and role

      // Execute both queries concurrently and handle potential failures
      const [progressResult, rolesResult] = await Promise.allSettled([
        progressPromise,                                       // Progress data query
        rolesPromise                                           // Roles data query
      ]);

      // Extract data from results, using empty array if query failed
      const progressData = progressResult.status === 'fulfilled' ? progressResult.value.data : [];
      const rolesData = rolesResult.status === 'fulfilled' ? rolesResult.value.data : [];

      // Process data - create a Map to store user information
      const userMap = new Map();
      
      // Add current user if authenticated
      if (user) {
        userMap.set(user.id, {                                 // Use user ID as map key
          id: user.id,                                         // User's unique identifier
          email: user.email || 'Unknown',                     // User's email or fallback
          created_at: user.created_at || new Date().toISOString(), // Account creation date
          email_confirmed_at: user.email_confirmed_at,        // Email confirmation timestamp
          last_sign_in_at: user.last_sign_in_at,              // Last login timestamp
          progress: {                                          // Initialize progress object
            total_questions: 0,                               // Start with 0 questions
            correct_answers: 0,                               // Start with 0 correct answers
            completion_rate: 0,                               // Start with 0% completion
            last_activity: null                               // No activity initially
          },
          role: user.email === 'neoguru@gmail.com' ? 'admin' : 'user' // Set role based on email
        });
      }

      // Process progress data - iterate through each progress record
      progressData?.forEach(record => {
        const userId = record.user_id;                         // Extract user ID from record
        if (!userMap.has(userId)) {                           // If user not in map, create entry
          userMap.set(userId, {
            id: userId,                                        // User identifier
            email: `user-${userId.slice(0, 8)}@example.com`,  // Generate placeholder email
            created_at: new Date().toISOString(),             // Use current date as creation
            email_confirmed_at: new Date().toISOString(),     // Assume email confirmed
            last_sign_in_at: record.last_attempt_at,          // Use last attempt as sign in
            progress: {                                        // Initialize progress
              total_questions: 0,                             // Start with 0 questions
              correct_answers: 0,                             // Start with 0 correct
              completion_rate: 0,                             // Start with 0% completion
              last_activity: record.last_attempt_at           // Set last activity
            },
            role: 'user'                                       // Default role is user
          });
        }
        
        const userData = userMap.get(userId);                  // Get user data from map
        userData.progress.total_questions++;                  // Increment total questions count
        if (record.correct) userData.progress.correct_answers++; // Increment correct if answer was right
        
        // Update last activity if this record is more recent
        if (!userData.progress.last_activity || 
            new Date(record.last_attempt_at) > new Date(userData.progress.last_activity)) {
          userData.progress.last_activity = record.last_attempt_at;
        }
      });

      // Apply roles - update user roles from database
      rolesData?.forEach(roleRecord => {
        if (userMap.has(roleRecord.user_id)) {               // Check if user exists in map
          userMap.get(roleRecord.user_id).role = roleRecord.role; // Update role from database
        }
      });

      // Calculate completion rates for each user
      userMap.forEach(userData => {
        userData.progress.completion_rate = userData.progress.total_questions > 0
          ? (userData.progress.correct_answers / userData.progress.total_questions) * 100 // Calculate percentage
          : 0;                                               // Set to 0 if no questions attempted
      });

      // Convert Map to Array for state storage
      const usersArray = Array.from(userMap.values());
      setUsers(usersArray);                                  // Update users state

      // Calculate and set admin statistics
      calculateStats(usersArray);

    } catch (error) {
      console.error('Data fetch error:', error);             // Log error to console
      throw error;                                           // Re-throw error for handling
    }
  };

  // Function to set fallback data when database is unavailable
  const setFallbackData = () => {
    // Create fallback data when database is unavailable
    const fallbackUsers: UserData[] = user ? [{             // Create array with current user if authenticated
      id: user.id,                                          // Use current user's ID
      email: user.email || 'neoguru@gmail.com',            // Use current user's email or fallback
      created_at: user.created_at || new Date().toISOString(), // Use creation date or current time
      email_confirmed_at: user.email_confirmed_at,         // Use email confirmation status
      last_sign_in_at: user.last_sign_in_at,               // Use last sign in timestamp
      progress: {                                           // Set mock progress data
        total_questions: 72,                                // Mock total questions attempted
        correct_answers: 65,                                // Mock correct answers
        completion_rate: 90.3,                             // Mock completion rate (90.3%)
        last_activity: new Date().toISOString()            // Set current time as last activity
      },
      role: 'admin'                                         // Set role as admin
    }] : [];                                                // Empty array if no user

    setUsers(fallbackUsers);                                // Update users state with fallback data
    setStats({                                              // Set fallback statistics
      totalUsers: fallbackUsers.length,                    // Total users count
      activeUsers: fallbackUsers.length,                   // Active users count (same as total)
      completionRate: 90.3,                                // Mock completion rate
      newUsersThisWeek: 0                                   // No new users in fallback mode
    });
  };

  // Function to calculate admin dashboard statistics from users array
  const calculateStats = (usersArray: UserData[]) => {
    const totalUsers = usersArray.length;                    // Count total number of users
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // Calculate date 7 days ago
    
    // Count users who signed in within the last week
    const activeUsers = usersArray.filter(u => 
      u.last_sign_in_at &&                                   // User has signed in before
      new Date(u.last_sign_in_at) > weekAgo                  // Sign in was within last week
    ).length;
    
    // Calculate average completion rate across all users
    const avgCompletion = usersArray.length > 0
      ? usersArray.reduce((sum, u) => sum + u.progress.completion_rate, 0) / usersArray.length // Sum all rates and divide by count
      : 0;                                                   // Return 0 if no users

    // Count users who registered within the last week
    const newUsersThisWeek = usersArray.filter(u => 
      new Date(u.created_at) > weekAgo                       // Creation date is within last week
    ).length;

    // Update stats state with calculated values
    setStats({
      totalUsers,                                            // Total user count
      activeUsers,                                           // Active user count
      completionRate: avgCompletion,                         // Average completion rate
      newUsersThisWeek                                       // New users this week count
    });
  };

  // Filter users based on search term (case-insensitive email search)
  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) // Convert both to lowercase for comparison
  );

  // Async function to toggle user role between admin and user
  const toggleUserRole = async (userId: string, currentRole: string) => {
    try {
      const newRole = currentRole === 'admin' ? 'user' : 'admin'; // Toggle between admin and user
      
      // Update user role in database using upsert (insert or update)
      const { error } = await supabase
        .from('user_roles')                                   // Target user_roles table
        .upsert({ user_id: userId, role: newRole }, { onConflict: 'user_id' }); // Upsert with conflict resolution

      if (error) throw error;                                 // Throw error if database operation fails

      // Update local state to reflect role change
      setUsers(users.map(u => 
        u.id === userId ? { ...u, role: newRole } : u         // Update role for matching user ID
      ));
    } catch (err) {
      console.error('Error updating user role:', err);        // Log error to console
      setError('Failed to update user role');                 // Set error message for UI
    }
  };

  // Show loading screen while data is being fetched
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">              {/* Main container with responsive padding */}
        <div className="bg-white rounded-lg shadow-lg p-6">      {/* White card with shadow and padding */}
          <div className="flex items-center justify-center min-h-[400px]"> {/* Centered content with minimum height */}
            <div className="text-center">                        {/* Center-aligned text container */}
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" /> {/* Spinning loader icon */}
              <p className="text-gray-600">Loading admin panel...</p> {/* Primary loading message */}
              <p className="text-sm text-gray-500 mt-2">This may take a few seconds</p> {/* Secondary loading message */}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main component JSX return
  return (
    <div className="container mx-auto px-4 py-8">              {/* Main container with responsive padding */}
      <div className="bg-white rounded-lg shadow-lg">          {/* White card container with shadow */}
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">  {/* Header section with bottom border */}
          <div className="flex items-center justify-between">  {/* Flex container for header content */}
            <div>                                              {/* Left side of header */}
              <h1 className="text-2xl font-bold flex items-center"> {/* Main title with icon */}
                <Shield className="w-6 h-6 mr-2 text-purple-600" /> {/* Shield icon */}
                Admin Dashboard                                {/* Title text */}
              </h1>
              <p className="text-gray-600 mt-1">              {/* Subtitle description */}
                Manage users, content, and system settings
              </p>
            </div>
            <div className="flex items-center space-x-2">      {/* Right side of header with status indicators */}
              <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${ // Dynamic connection status badge
                connectionStatus === 'connected' ? 'bg-green-100 text-green-800' : // Green for connected
                connectionStatus === 'error' ? 'bg-red-100 text-red-800' :         // Red for error
                'bg-yellow-100 text-yellow-800'                                    // Yellow for checking
              }`}>
                {connectionStatus === 'connected' && <CheckCircle className="w-4 h-4 mr-1" />} {/* Check icon for connected */}
                {connectionStatus === 'error' && <XCircle className="w-4 h-4 mr-1" />}           {/* X icon for error */}
                {connectionStatus === 'checking' && <Loader2 className="w-4 h-4 mr-1 animate-spin" />} {/* Spinner for checking */}
                {connectionStatus === 'connected' ? 'Connected' :                  {/* Dynamic status text */}
                 connectionStatus === 'error' ? 'Database Error' : 'Checking...'}
              </div>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium"> {/* Administrator badge */}
                Administrator
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"> {/* Duplicate administrator badge */}
                Administrator
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">              {/* Tab container with bottom border */}
          <nav className="flex space-x-8 px-6">                 {/* Navigation flex container with spacing */}
            {[                                                   // Array of tab configuration objects
              { id: 'overview', label: 'Overview', icon: BarChart3 },     // Overview tab with chart icon
              { id: 'users', label: 'Users', icon: Users },               // Users tab with users icon
              { id: 'notifications', label: 'Notifications', icon: Bell }, // Notifications tab with bell icon
              { id: 'content', label: 'Content', icon: Database },        // Content tab with database icon
              { id: 'settings', label: 'Settings', icon: Settings }       // Settings tab with settings icon
            ].map(tab => {                                       // Map through tabs to create buttons
              const Icon = tab.icon;                            // Extract icon component
              return (
                <button                                          // Tab button element
                  key={tab.id}                                   // Unique key for React
                  onClick={() => setSelectedTab(tab.id as any)}  // Click handler to change active tab
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${ // Dynamic styling based on selection
                    selectedTab === tab.id
                      ? 'border-purple-500 text-purple-600'     // Active tab styling (purple)
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300' // Inactive tab styling with hover
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />             {/* Tab icon */}
                  {tab.label}                                   {/* Tab label text */}
                </button>
              );
            })}
          </nav>
        </div>

        {error && (                                          // Conditional error display
          <div className="mx-6 mt-4 p-4 bg-yellow-100 text-yellow-700 rounded-lg flex items-center"> {/* Error container with yellow styling */}
            <AlertCircle className="w-5 h-5 mr-2" />            {/* Alert circle icon */}
            <div className="flex-1">                            {/* Error message container that takes available space */}
              {error}                                           {/* Error message text */}
            </div>
            <button                                             {/* Retry button */}
              onClick={fetchAdminData}                          {/* Click handler to retry data fetching */}
              className="ml-4 px-3 py-1 bg-yellow-200 hover:bg-yellow-300 rounded text-sm flex items-center" {/* Button styling with hover effect */}
            >
              <RefreshCw className="w-4 h-4 mr-1" />           {/* Refresh icon */}
              Retry                                             {/* Button text */}
            </button>
          </div>
        )}

        {/* Tab Content */}
        <div className="p-6">                                   {/* Main content area with padding */}
          {selectedTab === 'overview' && (                      // Overview tab content
            <div className="space-y-6">                         {/* Container with vertical spacing */}
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"> {/* Responsive grid for stats cards */}
                <div className="bg-blue-50 p-6 rounded-lg">     {/* Total Users card with blue theme */}
                  <div className="flex items-center">           {/* Flex container for icon and content */}
                    <Users className="w-8 h-8 text-blue-600" /> {/* Users icon */}
                    <div className="ml-4">                      {/* Content container with left margin */}
                      <p className="text-sm font-medium text-blue-600">Total Users</p> {/* Card label */}
                      <p className="text-2xl font-bold text-blue-900">{stats.totalUsers}</p> {/* Total users count */}
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-6 rounded-lg">    {/* Active Users card with green theme */}
                  <div className="flex items-center">           {/* Flex container for icon and content */}
                    <UserCheck className="w-8 h-8 text-green-600" /> {/* User check icon */}
                    <div className="ml-4">                      {/* Content container with left margin */}
                      <p className="text-sm font-medium text-green-600">Active Users</p> {/* Card label */}
                      <p className="text-2xl font-bold text-green-900">{stats.activeUsers}</p> {/* Active users count */}
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 p-6 rounded-lg">   {/* Completion rate card with purple theme */}
                  <div className="flex items-center">           {/* Flex container for icon and content */}
                    <TrendingUp className="w-8 h-8 text-purple-600" /> {/* Trending up icon */}
                    <div className="ml-4">                      {/* Content container with left margin */}
                      <p className="text-sm font-medium text-purple-600">Avg. Completion</p> {/* Card label */}
                      <p className="text-2xl font-bold text-purple-900"> {/* Completion rate percentage */}
                        {stats.completionRate.toFixed(1)}%      {/* Format to 1 decimal place */}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 p-6 rounded-lg">   {/* New users card with orange theme */}
                  <div className="flex items-center">           {/* Flex container for icon and content */}
                    <Calendar className="w-8 h-8 text-orange-600" /> {/* Calendar icon */}
                    <div className="ml-4">                      {/* Content container with left margin */}
                      <p className="text-sm font-medium text-orange-600">New This Week</p> {/* Card label */}
                      <p className="text-2xl font-bold text-orange-900">{stats.newUsersThisWeek}</p> {/* New users count */}
                    </div>
                  </div>
                </div>
              </div>

              {/* System Status */}
              <div className="bg-gray-50 p-6 rounded-lg">        {/* System status container with gray background */}
                <h3 className="text-lg font-semibold mb-4">System Status</h3> {/* Section title */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4"> {/* Responsive grid for status items */}
                  <div className="flex items-center">            {/* Database status item */}
                    {connectionStatus === 'connected' ? (        // Conditional icon based on connection status
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" /> // Green check for connected
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500 mr-2" />       // Red X for disconnected
                    )}
                    <span className="text-sm">                   {/* Status text */}
                      Database {connectionStatus === 'connected' ? 'Connected' : 'Disconnected'} {/* Dynamic database status */}
                    </span>
                  </div>
                  <div className="flex items-center">            {/* Authentication status item */}
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" /> {/* Green check icon */}
                    <span className="text-sm">Authentication Active</span> {/* Authentication status text */}
                  </div>
                  <div className="flex items-center">            {/* Admin panel status item */}
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" /> {/* Green check icon */}
                    <span className="text-sm">Admin Panel Operational</span> {/* Admin panel status text */}
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'users' && (                        // Users tab content
            <div className="space-y-6">                         {/* Container with vertical spacing */}
              {/* Search */}
              <div className="relative max-w-md">               {/* Search container with max width */}
                <input                                          {/* Search input field */}
                  type="text"                                   {/* Text input type */}
                  placeholder="Search users..."                {/* Placeholder text */}
                  className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 w-full" {/* Input styling with focus states */}
                  value={searchTerm}                            {/* Controlled input value */}
                  onChange={(e) => setSearchTerm(e.target.value)} {/* Update search term on change */}
                />
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" /> {/* Search icon positioned absolutely */}
              </div>

              {/* Users Table */}
              <div className="overflow-x-auto">                {/* Horizontal scroll container for table */}
                <table className="w-full">                     {/* Full width table */}
                  <thead>                                       {/* Table header */}
                    <tr className="bg-gray-50">                {/* Header row with gray background */}
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> {/* User column header */}
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> {/* Role column header */}
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> {/* Progress column header */}
                        Progress
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> {/* Last Activity column header */}
                        Last Activity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> {/* Actions column header */}
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200"> {/* Table body with white background and row dividers */}
                    {filteredUsers.map((userData) => (          // Map through filtered users array
                      <tr key={userData.id} className="hover:bg-gray-50"> {/* Table row with hover effect */}
                        <td className="px-6 py-4 whitespace-nowrap"> {/* User info cell */}
                          <div className="flex items-center">    {/* Flex container for user info */}
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center"> {/* User avatar container */}
                              <Users className="w-5 h-5 text-gray-600" /> {/* Users icon as avatar */}
                            </div>
                            <div className="ml-4">              {/* User details container */}
                              <div className="text-sm font-medium text-gray-900"> {/* User email */}
                                {userData.email}
                              </div>
                              <div className="text-sm text-gray-500"> {/* User ID (truncated) */}
                                ID: {userData.id.slice(0, 8)}...
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">  {/* Role cell */}
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${ // Dynamic role badge styling
                            userData.role === 'admin'
                              ? 'bg-purple-100 text-purple-800'    // Purple for admin
                              : 'bg-gray-100 text-gray-800'        // Gray for regular user
                          }`}>
                            {userData.role}                        {/* Role text */}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">  {/* Progress cell */}
                          <div className="flex items-center">      {/* Progress container */}
                            <Award className="w-4 h-4 text-green-500 mr-2" /> {/* Award icon */}
                            <span className="text-sm text-gray-900"> {/* Progress text */}
                              {userData.progress.correct_answers} / {userData.progress.total_questions} {/* Correct/total answers */}
                            </span>
                            <div className="ml-2 w-16 bg-gray-200 rounded-full h-2"> {/* Progress bar background */}
                              <div                                  {/* Progress bar fill */}
                                className="bg-blue-600 h-2 rounded-full" {/* Blue progress bar */}
                                style={{ width: `${Math.min(userData.progress.completion_rate, 100)}%` }} {/* Dynamic width based on completion */}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"> {/* Last activity cell */}
                          {userData.progress.last_activity         // Conditional last activity display
                            ? new Date(userData.progress.last_activity).toLocaleDateString() // Format date if exists
                            : 'Never'                              // Show 'Never' if no activity
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