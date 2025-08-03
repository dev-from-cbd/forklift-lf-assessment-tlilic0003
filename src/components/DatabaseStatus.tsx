// Import React and hooks for component functionality
import React, { useEffect, useState } from 'react';
// Import Supabase client for database operations
import { supabase } from '../config/supabase';
// Import Lucide React icons for UI elements
import { CheckCircle, XCircle, AlertCircle, Database, Users, Shield, Loader2, RefreshCw } from 'lucide-react';
// Import authentication context to access user data
import { useAuth } from '../contexts/AuthContext';

// Interface defining the structure of database status information
interface DatabaseStatus {
  connection: 'connected' | 'disconnected' | 'checking'; // Status of database connection
  tables: {
    user_roles: boolean; // Whether user_roles table is accessible
    user_progress: boolean; // Whether user_progress table is accessible
  };
  auth: 'working' | 'error' | 'checking'; // Status of authentication service
  adminAccess: boolean; // Whether current user has admin privileges
  userCount: number; // Total number of users in the system
  error?: string; // Optional error message if something fails
}

// Component for displaying and checking database connection status
const DatabaseStatus: React.FC = () => {
  // Get current authenticated user from context
  const { user } = useAuth();
  
  // Initialize database status state with default checking values
  const [status, setStatus] = useState<DatabaseStatus>({
    connection: 'checking', // Initial connection status is checking
    tables: {
      user_roles: false, // Initially assume tables are not accessible
      user_progress: false
    },
    auth: 'checking', // Initial auth status is checking
    adminAccess: false, // Initially assume no admin access
    userCount: 0 // Initially no users counted
  });
  
  // State to track if status check is in progress
  const [loading, setLoading] = useState(true);
  
  // State to track if connection timeout has been reached
  const [timeoutReached, setTimeoutReached] = useState(false);

  // Effect to check database status when component mounts or user changes
  useEffect(() => {
    // Set timeout to prevent infinite loading if database check takes too long
    const timeout = setTimeout(() => {
      setTimeoutReached(true); // Mark timeout as reached
      setLoading(false); // Stop loading state
    }, 10000); // 10 seconds timeout

    // Check database status and clear timeout when done regardless of success/failure
    checkDatabaseStatus().finally(() => {
      clearTimeout(timeout);
    });

    // Cleanup function to clear timeout if component unmounts
    return () => clearTimeout(timeout);
  }, [user]); // Re-run when user changes

  // Function to check database connection status and related information
  const checkDatabaseStatus = async () => {
    setLoading(true); // Start loading state
    setTimeoutReached(false); // Reset timeout flag
    
    try {
      // Check if required environment variables are present
      const hasSupabaseUrl = !!import.meta.env.VITE_SUPABASE_URL;
      const hasSupabaseKey = !!import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      // If environment variables are missing, update status and exit early
      if (!hasSupabaseUrl || !hasSupabaseKey) {
        setStatus({
          connection: 'disconnected', // Mark connection as disconnected
          tables: { user_roles: false, user_progress: false }, // Tables not accessible
          auth: 'error', // Auth service has error
          adminAccess: false, // No admin access
          userCount: 0, // No users
          error: 'Missing Supabase environment variables' // Set error message
        });
        setLoading(false); // Stop loading state
        return; // Exit function early
      }

      // Test basic database connection with a 5-second timeout
      const connectionPromise = supabase
        .from('user_roles') // Try to access user_roles table
        .select('count', { count: 'exact', head: true }); // Just get count, don't fetch actual data

      // Create a promise that rejects after 5 seconds to implement connection timeout
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Connection timeout')), 5000) // 5 second timeout
      );

      // Race the connection attempt against the timeout
      const { data: connectionTest, error: connectionError } = await Promise.race([
        connectionPromise,
        timeoutPromise
      ]) as any;

      // If connection failed or timed out, update status and exit early
      if (connectionError) {
        setStatus(prev => ({
          ...prev, // Keep previous state for other fields
          connection: 'disconnected', // Mark connection as failed
          error: connectionError.message, // Store error message
          auth: 'error' // Auth also marked as error since it depends on connection
        }));
        setLoading(false); // Stop loading state
        return; // Exit function early
      }

      // Check if required database tables exist and are accessible
      const rolesPromise = supabase.from('user_roles').select('id').limit(1); // Check user_roles table
      const progressPromise = supabase.from('user_progress').select('id').limit(1); // Check user_progress table
      
      // Use Promise.allSettled to continue even if some queries fail
      const [rolesResult, progressResult] = await Promise.allSettled([
        rolesPromise,
        progressPromise
      ]);

      // Check authentication service status by getting current session
      const { data: { session }, error: authError } = await supabase.auth.getSession();

      // Check if current user has admin access
      let adminAccess = false;
      if (session?.user) { // If user is logged in
        if (session.user.email === 'neoguru@gmail.com') { // Hardcoded admin email
          adminAccess = true; // Grant admin access to specific email
        } else {
          try {
            // Check user_roles table for admin role
            const { data: roleData } = await supabase
              .from('user_roles')
              .select('role') // Get user's role
              .eq('user_id', session.user.id) // Filter by user ID
              .single(); // Expect only one result
            adminAccess = roleData?.role === 'admin'; // Check if role is admin
          } catch (err) {
            console.log('Role check failed:', err); // Log error but continue
          }
        }
      }

      // Get total count of users in the system
      let userCount = 0;
      try {
        // Count distinct users in user_progress table
        const { count } = await supabase
          .from('user_progress')
          .select('user_id', { count: 'exact', head: true }); // Count users without fetching data
        userCount = count || 0; // Use count or default to 0
      } catch (err) {
        console.log('User count failed:', err); // Log error but continue
      }

      setStatus({
        connection: 'connected',
        tables: {
          user_roles: rolesResult.status === 'fulfilled' && !rolesResult.value.error,
          user_progress: progressResult.status === 'fulfilled' && !progressResult.value.error
        },
        auth: authError ? 'error' : 'working',
        adminAccess,
        userCount
      });

    } catch (error) {
      console.error('Database status check failed:', error);
      setStatus(prev => ({
        ...prev,
        connection: 'disconnected',
        error: error instanceof Error ? error.message : 'Unknown error'
      }));
    } finally {
      setLoading(false);
    }
  };

  const StatusIcon = ({ status }: { status: 'connected' | 'disconnected' | 'checking' | 'working' | 'error' }) => {
    switch (status) {
      case 'connected':
      case 'working':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'disconnected':
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'checking':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
  };

  if (loading && !timeoutReached) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Checking database status...</p>
          <p className="text-sm text-gray-500 mt-2">This may take a few seconds</p>
        </div>
      </div>
    );
  }

  if (timeoutReached) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-600 mb-4">Connection Timeout</h2>
            <p className="text-gray-600 mb-6">
              Unable to connect to the database within 10 seconds. This might indicate:
            </p>
            <ul className="text-left text-gray-600 mb-6 max-w-md mx-auto">
              <li>• Missing or incorrect Supabase configuration</li>
              <li>• Network connectivity issues</li>
              <li>• Database server problems</li>
              <li>• Environment variables not set</li>
            </ul>
            <button
              onClick={checkDatabaseStatus}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Database className="w-6 h-6 text-blue-600 mr-2" />
            <h2 className="text-2xl font-bold">Database Connection Status</h2>
          </div>
          <button
            onClick={checkDatabaseStatus}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh Status
          </button>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Connection Status */}
          <div className="bg-gray-50 p-4 rounded-lg border">
            <div className="flex items-center mb-3">
              <StatusIcon status={status.connection} />
              <h3 className="text-lg font-semibold ml-2">Connection</h3>
            </div>
            <p className="text-sm text-gray-600">
              Status: <span className="font-medium capitalize">{status.connection}</span>
            </p>
            {status.error && (
              <p className="text-sm text-red-600 mt-2 break-words">Error: {status.error}</p>
            )}
          </div>

          {/* Authentication Status */}
          <div className="bg-gray-50 p-4 rounded-lg border">
            <div className="flex items-center mb-3">
              <StatusIcon status={status.auth} />
              <h3 className="text-lg font-semibold ml-2">Authentication</h3>
            </div>
            <p className="text-sm text-gray-600">
              Status: <span className="font-medium capitalize">{status.auth}</span>
            </p>
            <p className="text-sm text-gray-600">
              Current User: <span className="font-medium">{user?.email || 'Not logged in'}</span>
            </p>
            <p className="text-sm text-gray-600">
              Admin Access: <span className={`font-medium ${status.adminAccess ? 'text-green-600' : 'text-red-600'}`}>
                {status.adminAccess ? 'Yes' : 'No'}
              </span>
            </p>
          </div>

          {/* Tables Status */}
          <div className="bg-gray-50 p-4 rounded-lg border">
            <div className="flex items-center mb-3">
              <Database className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-semibold ml-2">Tables</h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <StatusIcon status={status.tables.user_roles ? 'connected' : 'disconnected'} />
                <span className="ml-2 text-sm">user_roles</span>
              </div>
              <div className="flex items-center">
                <StatusIcon status={status.tables.user_progress ? 'connected' : 'disconnected'} />
                <span className="ml-2 text-sm">user_progress</span>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-gray-50 p-4 rounded-lg border">
            <div className="flex items-center mb-3">
              <Users className="w-5 h-5 text-green-500" />
              <h3 className="text-lg font-semibold ml-2">Statistics</h3>
            </div>
            <p className="text-sm text-gray-600">
              Total Users: <span className="font-medium text-2xl text-blue-600">{status.userCount}</span>
            </p>
          </div>
        </div>

        {/* Environment Info */}
        <div className="bg-blue-50 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Shield className="w-5 h-5 text-blue-600 mr-2" />
            Environment Configuration
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <p className="text-gray-600">
                Supabase URL: <span className="font-mono text-xs bg-white px-2 py-1 rounded">
                  {import.meta.env.VITE_SUPABASE_URL ? '✓ Configured' : '✗ Missing'}
                </span>
              </p>
              <p className="text-gray-600">
                Supabase Key: <span className="font-mono text-xs bg-white px-2 py-1 rounded">
                  {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✓ Configured' : '✗ Missing'}
                </span>
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-gray-600">
                Environment: <span className="font-medium bg-white px-2 py-1 rounded">
                  {import.meta.env.PROD ? 'Production' : 'Development'}
                </span>
              </p>
              <p className="text-gray-600">
                Mode: <span className="font-medium bg-white px-2 py-1 rounded">{import.meta.env.MODE}</span>
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