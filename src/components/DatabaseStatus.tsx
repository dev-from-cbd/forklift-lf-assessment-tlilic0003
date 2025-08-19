// Import React hooks for component state and lifecycle management
import React, { useEffect, useState } from 'react';
// Import Supabase client configuration for database operations
import { supabase } from '../config/supabase';
// Import various icons from Lucide React for UI status indicators
import { CheckCircle, XCircle, AlertCircle, Database, Users, Shield, Loader2, RefreshCw } from 'lucide-react';
// Import authentication context hook for user management
import { useAuth } from '../contexts/AuthContext';

// Interface defining the structure of database status information
interface DatabaseStatus {
  connection: 'connected' | 'disconnected' | 'checking'; // Database connection state
  tables: {
    user_roles: boolean;     // Whether user_roles table is accessible
    user_progress: boolean;  // Whether user_progress table is accessible
  };
  auth: 'working' | 'error' | 'checking';  // Authentication system status
  adminAccess: boolean;      // Whether current user has admin privileges
  userCount: number;         // Total number of users in the system
  error?: string;            // Optional error message if something fails
}

// Main functional component for displaying database status
const DatabaseStatus: React.FC = () => {
  // Get current authenticated user from auth context
  const { user } = useAuth();
  // State to track overall database status with initial checking values
  const [status, setStatus] = useState<DatabaseStatus>({
    connection: 'checking',    // Start with checking connection status
    tables: {
      user_roles: false,       // Initially assume tables are not accessible
      user_progress: false     // Initially assume tables are not accessible
    },
    auth: 'checking',          // Start with checking auth status
    adminAccess: false,        // Initially assume no admin access
    userCount: 0               // Start with zero user count
  });
  // State to track if the component is currently loading
  const [loading, setLoading] = useState(true);
  // State to track if connection timeout has been reached
  const [timeoutReached, setTimeoutReached] = useState(false);

  // Effect hook to check database status when component mounts or user changes
  useEffect(() => {
    // Set timeout to prevent infinite loading state
    const timeout = setTimeout(() => {
      setTimeoutReached(true);  // Mark that timeout has been reached
      setLoading(false);        // Stop loading indicator
    }, 10000); // 10 seconds timeout limit

    // Start database status check and clear timeout when done
    checkDatabaseStatus().finally(() => {
      clearTimeout(timeout);    // Clear timeout to prevent memory leaks
    });

    // Cleanup function to clear timeout on component unmount
    return () => clearTimeout(timeout);
  }, [user]); // Re-run effect when user changes

  // Async function to perform comprehensive database status check
  const checkDatabaseStatus = async () => {
    // Set loading state to show progress indicator
    setLoading(true);
    // Reset timeout flag for fresh check
    setTimeoutReached(false);
    
    try {
      // Check environment variables first before attempting connection
      const hasSupabaseUrl = !!import.meta.env.VITE_SUPABASE_URL;   // Check if URL is configured
      const hasSupabaseKey = !!import.meta.env.VITE_SUPABASE_ANON_KEY; // Check if API key is configured
      
      // If essential environment variables are missing, set error state
      if (!hasSupabaseUrl || !hasSupabaseKey) {
        setStatus({
          connection: 'disconnected',     // Mark connection as failed
          tables: { user_roles: false, user_progress: false }, // Mark tables as inaccessible
          auth: 'error',                 // Mark auth as error
          adminAccess: false,            // No admin access without connection
          userCount: 0,                  // Zero users if no connection
          error: 'Missing Supabase environment variables' // Specific error message
        });
        setLoading(false);               // Stop loading indicator
        return;                          // Exit early
      }

      // Test basic connection with timeout to prevent hanging
      const connectionPromise = supabase
        .from('user_roles')                                    // Query user_roles table
        .select('count', { count: 'exact', head: true });      // Get count without data

      // Create timeout promise to limit connection wait time
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Connection timeout')), 5000) // 5 second timeout
      );

      // Race connection test against timeout to get fastest result
      const { data: connectionTest, error: connectionError } = await Promise.race([
        connectionPromise,    // Actual database query
        timeoutPromise        // Timeout fallback
      ]) as any;

      // If connection failed, update status and exit
      if (connectionError) {
        setStatus(prev => ({
          ...prev,                              // Keep existing status
          connection: 'disconnected',           // Mark connection as failed
          error: connectionError.message,       // Store error message
          auth: 'error'                        // Mark auth as error
        }));
        setLoading(false);                    // Stop loading indicator
        return;                               // Exit function early
      }

      // Check tables existence by attempting to query each table
      const rolesPromise = supabase.from('user_roles').select('id').limit(1);      // Test user_roles table access
      const progressPromise = supabase.from('user_progress').select('id').limit(1); // Test user_progress table access
      
      // Execute both table checks simultaneously and wait for all to complete
      const [rolesResult, progressResult] = await Promise.allSettled([
        rolesPromise,     // Check user_roles table
        progressPromise   // Check user_progress table
      ]);

      // Check auth status by getting current session
      const { data: { session }, error: authError } = await supabase.auth.getSession();

      // Check admin access for current user
      let adminAccess = false;                    // Default to no admin access
      if (session?.user) {                        // If user is logged in
        if (session.user.email === 'neoguru@gmail.com') {  // Check for hardcoded admin email
          adminAccess = true;                     // Grant admin access for specific email
        } else {
          try {
            // Query user_roles table to check role
            const { data: roleData } = await supabase
              .from('user_roles')                 // Query user roles table
              .select('role')                     // Select only role column
              .eq('user_id', session.user.id)     // Filter by current user ID
              .single();                          // Expect single result
            adminAccess = roleData?.role === 'admin';  // Check if role is admin
          } catch (err) {
            console.log('Role check failed:', err);    // Log role check errors
          }
        }
      }

      // Get user count from database
      let userCount = 0;                          // Default to zero users
      try {
        // Count unique users in user_progress table
        const { count } = await supabase
          .from('user_progress')                  // Query user progress table
          .select('user_id', { count: 'exact', head: true }); // Count records only
        userCount = count || 0;                   // Use count or default to 0
      } catch (err) {
        console.log('User count failed:', err);    // Log user count errors
      }

      // Update status with all collected information
      setStatus({
        connection: 'connected',                                                    // Mark connection as successful
        tables: {
          user_roles: rolesResult.status === 'fulfilled' && !rolesResult.value.error,      // Check if user_roles query succeeded
          user_progress: progressResult.status === 'fulfilled' && !progressResult.value.error // Check if user_progress query succeeded
        },
        auth: authError ? 'error' : 'working',                                     // Set auth status based on session check
        adminAccess,                                                               // Set admin access flag
        userCount                                                                  // Set user count
      });

    } catch (error) {
      // Handle any unexpected errors during status check
      console.error('Database status check failed:', error);                      // Log error for debugging
      setStatus(prev => ({
        ...prev,                                                                   // Keep existing status
        connection: 'disconnected',                                               // Mark connection as failed
        error: error instanceof Error ? error.message : 'Unknown error'          // Store error message
      }));
    } finally {
      setLoading(false);                                                         // Always stop loading indicator
    }
  };

  // Component to display appropriate icon based on status
  const StatusIcon = ({ status }: { status: 'connected' | 'disconnected' | 'checking' | 'working' | 'error' }) => {
    switch (status) {
      case 'connected':                                                          // Database connection successful
      case 'working':                                                            // Authentication working
        return <CheckCircle className="w-5 h-5 text-green-500" />;               // Green checkmark icon
      case 'disconnected':                                                       // Database connection failed
      case 'error':                                                              // Error occurred
        return <XCircle className="w-5 h-5 text-red-500" />;                     // Red X icon
      case 'checking':                                                           // Currently checking status
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;       // Blue spinning loader
      default:                                                                   // Unknown status
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;              // Yellow warning icon
    }
  };

  // Show loading screen while checking database status
  if (loading && !timeoutReached) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">        {/* Center loading content */}
        <div className="text-center">                                           {/* Center text alignment */}
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" /> {/* Spinning loader icon */}
          <p className="text-gray-600">Checking database status...</p>           {/* Main loading message */}
          <p className="text-sm text-gray-500 mt-2">This may take a few seconds</p> {/* Additional info */}
        </div>
      </div>
    );
  }

  // Show timeout error screen if connection takes too long
  if (timeoutReached) {
    return (
      <div className="max-w-6xl mx-auto p-6">                                    {/* Main container with max width */}
        <div className="bg-white rounded-lg shadow-lg p-6">                      {/* White card with shadow */}
          <div className="text-center">                                         {/* Center all content */}
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />         {/* Large red X icon */}
            <h2 className="text-2xl font-bold text-red-600 mb-4">Connection Timeout</h2> {/* Error title */}
            <p className="text-gray-600 mb-6">                                  {/* Explanation text */}
              Unable to connect to the database within 10 seconds. This might indicate:
            </p>
            <ul className="text-left text-gray-600 mb-6 max-w-md mx-auto">     {/* List of possible causes */}
               <li>• Missing or incorrect Supabase configuration</li>             {/* Config issue */}
               <li>• Network connectivity issues</li>                            {/* Network issue */}
               <li>• Database server problems</li>                               {/* Server issue */}
               <li>• Environment variables not set</li>                          {/* Environment issue */}
             </ul>
            <button                                                              {/* Retry button */}
              onClick={checkDatabaseStatus}                                      {/* Trigger status check */}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" {/* Button styling */}
            >
              Try Again                                                          {/* Button text */}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main component render - show database status dashboard
  return (
    <div className="max-w-6xl mx-auto p-6">                                    {/* Main container with max width */}
      <div className="bg-white rounded-lg shadow-lg p-6">                      {/* White card with shadow */}
        <div className="flex items-center justify-between mb-6">               {/* Header with title and refresh button */}
          <div className="flex items-center">                                   {/* Title section */}
             <Database className="w-6 h-6 text-blue-600 mr-2" />                {/* Database icon */}
             <h2 className="text-2xl font-bold">Database Connection Status</h2>  {/* Page title */}
           </div>
          <button                                                              {/* Refresh button */}
            onClick={checkDatabaseStatus}                                      {/* Trigger status check */}
            disabled={loading}                                                 {/* Disable when loading */}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50" {/* Button styling */}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> {/* Refresh icon with conditional spin */}
            Refresh Status                                                     {/* Button text */}
          </button>
        </div>

        {/* Status Cards */}                                                   {/* Grid container for status cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"> {/* Responsive grid layout */}
          {/* Connection Status */}                                               {/* Database connection status card */}
          <div className="bg-gray-50 p-4 rounded-lg border">                     {/* Card styling */}
            <div className="flex items-center mb-3">                             {/* Card header */}
              <StatusIcon status={status.connection} />                         {/* Connection status icon */}
              <h3 className="text-lg font-semibold ml-2">Connection</h3>         {/* Card title */}
            </div>
            <p className="text-sm text-gray-600">                               {/* Status text */}
              Status: <span className="font-medium capitalize">{status.connection}</span> {/* Connection state */}
            </p>
            {status.error && (                                                  {/* Conditional error display */}
              <p className="text-sm text-red-600 mt-2 break-words">Error: {status.error}</p> {/* Error message */}
            )}
          </div>

          {/* Authentication Status */}                                         {/* Authentication system status card */}
          <div className="bg-gray-50 p-4 rounded-lg border">                     {/* Card styling */}
            <div className="flex items-center mb-3">                             {/* Card header */}
              <StatusIcon status={status.auth} />                               {/* Auth status icon */}
              <h3 className="text-lg font-semibold ml-2">Authentication</h3>     {/* Card title */}
            </div>
            <p className="text-sm text-gray-600">                               {/* Auth status text */}
              Status: <span className="font-medium capitalize">{status.auth}</span> {/* Auth state */}
            </p>
            <p className="text-sm text-gray-600">                               {/* Current user info */}
              Current User: <span className="font-medium">{user?.email || 'Not logged in'}</span> {/* User email or not logged in */}
            </p>
            <p className="text-sm text-gray-600">                               {/* Admin access info */}
               Admin Access: <span className={`font-medium ${status.adminAccess ? 'text-green-600' : 'text-red-600'}`}> {/* Conditional color styling */}
                 {status.adminAccess ? 'Yes' : 'No'}                             {/* Admin access status */}
               </span>
             </p>
          </div>

          {/* Tables Status */}                                               {/* Database tables accessibility card */}
          <div className="bg-gray-50 p-4 rounded-lg border">                     {/* Card styling */}
            <div className="flex items-center mb-3">                             {/* Card header */}
              <Database className="w-5 h-5 text-blue-500" />                     {/* Database icon */}
              <h3 className="text-lg font-semibold ml-2">Tables</h3>             {/* Card title */}
            </div>
            <div className="space-y-2">                                         {/* Table list container */}
              <div className="flex items-center">                               {/* User roles table status */}
                <StatusIcon status={status.tables.user_roles ? 'connected' : 'disconnected'} /> {/* Table access icon */}
                <span className="ml-2 text-sm">user_roles</span>                 {/* Table name */}
              </div>
              <div className="flex items-center">                               {/* User progress table status */}
                <StatusIcon status={status.tables.user_progress ? 'connected' : 'disconnected'} /> {/* Table access icon */}
                <span className="ml-2 text-sm">user_progress</span>               {/* Table name */}
              </div>
            </div>
          </div>

          {/* Statistics */}                                               {/* System statistics card */}
          <div className="bg-gray-50 p-4 rounded-lg border">                     {/* Card styling */}
            <div className="flex items-center mb-3">                             {/* Card header */}
              <Users className="w-5 h-5 text-green-500" />                       {/* Users icon */}
              <h3 className="text-lg font-semibold ml-2">Statistics</h3>         {/* Card title */}
            </div>
            <p className="text-sm text-gray-600">                               {/* User count display */}
              Total Users: <span className="font-medium text-2xl text-blue-600">{status.userCount}</span> {/* Large user count number */}
            </p>
          </div>
        </div>

        {/* Environment Info */}                                           {/* Environment configuration section */}
        <div className="bg-blue-50 p-6 rounded-lg mb-6">                       {/* Blue background container */}
          <h3 className="text-lg font-semibold mb-4 flex items-center">         {/* Section header */}
            <Shield className="w-5 h-5 text-blue-600 mr-2" />                   {/* Shield icon */}
            Environment Configuration                                            {/* Section title */}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">       {/* Two-column grid layout */}
            <div className="space-y-2">                                         {/* Left column */}
              <p className="text-gray-600">                                     {/* Supabase URL status */}
                Supabase URL: <span className="font-mono text-xs bg-white px-2 py-1 rounded"> {/* Status badge */}
                  {import.meta.env.VITE_SUPABASE_URL ? '✓ Configured' : '✗ Missing'} {/* Check if URL is set */}
                </span>
              </p>
              <p className="text-gray-600">                                     {/* Supabase key status */}
                Supabase Key: <span className="font-mono text-xs bg-white px-2 py-1 rounded"> {/* Status badge */}
                  {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✓ Configured' : '✗ Missing'} {/* Check if key is set */}
                </span>
              </p>
            </div>
            <div className="space-y-2">                                         {/* Right column */}
              <p className="text-gray-600">                                     {/* Environment type */}
                Environment: <span className="font-medium bg-white px-2 py-1 rounded"> {/* Environment badge */}
                  {import.meta.env.PROD ? 'Production' : 'Development'}         {/* Check if production */}
                </span>
              </p>
              <p className="text-gray-600">                                     {/* Build mode */}
                Mode: <span className="font-medium bg-white px-2 py-1 rounded">{import.meta.env.MODE}</span> {/* Show build mode */}
              </p>
            </div>
          </div>
        </div>

        {/* Current User Info */}
        {user && (
          <div className="bg-green-50 p-6 rounded-lg mb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Users className="w-5 h-5 text-green-600 mr-2" />
              Current User Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Email: <span className="font-medium">{user.email}</span></p>
                <p className="text-gray-600">User ID: <span className="font-mono text-xs">{user.id}</span></p>
              </div>
              <div>
                <p className="text-gray-600">Created: <span className="font-medium">
                  {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                </span></p>
                <p className="text-gray-600">Last Sign In: <span className="font-medium">
                  {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Unknown'}
                </span></p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4">
          <a
            href="/admin"
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
          >
            <Shield className="w-4 h-4 mr-2" />
            Admin Panel
          </a>
          <a
            href="/register"
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
          >
            <Users className="w-4 h-4 mr-2" />
            Register New User
          </a>
          <a
            href="/login"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Users className="w-4 h-4 mr-2" />
            Login
          </a>
          <a
            href="/"
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center"
          >
            <Database className="w-4 h-4 mr-2" />
            Back to Home
          </a>
        </div>

        {/* Debug Information */}
        <div className="mt-8 bg-gray-100 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Debug Information</h4>
          <pre className="text-xs text-gray-600 overflow-x-auto">
            {JSON.stringify({
              connection: status.connection,
              tables: status.tables,
              auth: status.auth,
              adminAccess: status.adminAccess,
              userCount: status.userCount,
              error: status.error,
              currentUser: user ? {
                email: user.email,
                id: user.id,
                created_at: user.created_at
              } : null,
              environment: {
                PROD: import.meta.env.PROD,
                MODE: import.meta.env.MODE,
                hasSupabaseUrl: !!import.meta.env.VITE_SUPABASE_URL,
                hasSupabaseKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
                supabaseUrl: import.meta.env.VITE_SUPABASE_URL ? 'Set' : 'Missing'
              }
            }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default DatabaseStatus;