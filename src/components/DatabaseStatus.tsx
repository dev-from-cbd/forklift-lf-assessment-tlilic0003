import React, { useEffect, useState } from 'react';
import { supabase } from '../config/supabase';
import { CheckCircle, XCircle, AlertCircle, Database, Users, Shield, Loader2, RefreshCw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface DatabaseStatus {
  connection: 'connected' | 'disconnected' | 'checking';
  tables: {
    user_roles: boolean;
    user_progress: boolean;
  };
  auth: 'working' | 'error' | 'checking';
  adminAccess: boolean;
  userCount: number;
  error?: string;
}

const DatabaseStatus: React.FC = () => {
  const { user } = useAuth();
  const [status, setStatus] = useState<DatabaseStatus>({
    connection: 'checking',
    tables: {
      user_roles: false,
      user_progress: false
    },
    auth: 'checking',
    adminAccess: false,
    userCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [timeoutReached, setTimeoutReached] = useState(false);

  useEffect(() => {
    // Set timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      setTimeoutReached(true);
      setLoading(false);
    }, 10000); // 10 seconds timeout

    checkDatabaseStatus().finally(() => {
      clearTimeout(timeout);
    });

    return () => clearTimeout(timeout);
  }, [user]);

  const checkDatabaseStatus = async () => {
    setLoading(true);
    setTimeoutReached(false);
    
    try {
      // Check environment variables first
      const hasSupabaseUrl = !!import.meta.env.VITE_SUPABASE_URL;
      const hasSupabaseKey = !!import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!hasSupabaseUrl || !hasSupabaseKey) {
        setStatus({
          connection: 'disconnected',
          tables: { user_roles: false, user_progress: false },
          auth: 'error',
          adminAccess: false,
          userCount: 0,
          error: 'Missing Supabase environment variables'
        });
        setLoading(false);
        return;
      }

      // Test basic connection with timeout
      const connectionPromise = supabase
        .from('user_roles')
        .select('count', { count: 'exact', head: true });

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Connection timeout')), 5000)
      );

      const { data: connectionTest, error: connectionError } = await Promise.race([
        connectionPromise,
        timeoutPromise
      ]) as any;

      if (connectionError) {
        setStatus(prev => ({
          ...prev,
          connection: 'disconnected',
          error: connectionError.message,
          auth: 'error'
        }));
        setLoading(false);
        return;
      }

      // Check tables existence
      const rolesPromise = supabase.from('user_roles').select('id').limit(1);
      const progressPromise = supabase.from('user_progress').select('id').limit(1);
      
      const [rolesResult, progressResult] = await Promise.allSettled([
        rolesPromise,
        progressPromise
      ]);

      // Check auth status
      const { data: { session }, error: authError } = await supabase.auth.getSession();

      // Check admin access
      let adminAccess = false;
      if (session?.user) {
        if (session.user.email === 'neoguru@gmail.com') {
          adminAccess = true;
        } else {
          try {
            const { data: roleData } = await supabase
              .from('user_roles')
              .select('role')
              .eq('user_id', session.user.id)
              .single();
            adminAccess = roleData?.role === 'admin';
          } catch (err) {
            console.log('Role check failed:', err);
          }
        }
      }

      // Get user count
      let userCount = 0;
      try {
        const { count } = await supabase
          .from('user_progress')
          .select('user_id', { count: 'exact', head: true });
        userCount = count || 0;
      } catch (err) {
        console.log('User count failed:', err);
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