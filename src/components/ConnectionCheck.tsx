import React, { useEffect, useState } from 'react';
import { supabase } from '../config/supabase';
import { CheckCircle, XCircle, AlertCircle, Database, Loader2 } from 'lucide-react';

const ConnectionCheck: React.FC = () => {
  const [status, setStatus] = useState<{
    connection: 'checking' | 'connected' | 'error';
    details: string;
    envVars: {
      hasUrl: boolean;
      hasKey: boolean;
      url?: string;
    };
    user: any;
  }>({
    connection: 'checking',
    details: '',
    envVars: { hasUrl: false, hasKey: false },
    user: null
  });

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      // Check environment variables
      const hasUrl = !!import.meta.env.VITE_SUPABASE_URL;
      const hasKey = !!import.meta.env.VITE_SUPABASE_ANON_KEY;
      const url = import.meta.env.VITE_SUPABASE_URL;

      if (!hasUrl || !hasKey) {
        setStatus({
          connection: 'error',
          details: 'Missing Supabase environment variables',
          envVars: { hasUrl, hasKey, url },
          user: null
        });
        return;
      }

      // Test database connection
      const { data: testData, error: testError } = await supabase
        .from('user_roles')
        .select('count', { count: 'exact', head: true });

      if (testError) {
        setStatus({
          connection: 'error',
          details: `Database error: ${testError.message}`,
          envVars: { hasUrl, hasKey, url },
          user: null
        });
        return;
      }

      // Check current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      setStatus({
        connection: 'connected',
        details: 'All systems operational',
        envVars: { hasUrl, hasKey, url },
        user: user
      });

    } catch (error) {
      setStatus({
        connection: 'error',
        details: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        envVars: { hasUrl: false, hasKey: false },
        user: null
      });
    }
  };

  const StatusIcon = () => {
    switch (status.connection) {
      case 'connected':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'error':
        return <XCircle className="w-6 h-6 text-red-500" />;
      default:
        return <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center mb-6">
          <Database className="w-8 h-8 text-blue-600 mr-3" />
          <h2 className="text-2xl font-bold">Supabase Connection Status</h2>
        </div>

        {/* Main Status */}
        <div className="flex items-center mb-6 p-4 rounded-lg bg-gray-50">
          <StatusIcon />
          <div className="ml-3">
            <h3 className="text-lg font-semibold capitalize">{status.connection}</h3>
            <p className="text-gray-600">{status.details}</p>
          </div>
        </div>

        {/* Environment Variables */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-3">Environment Configuration</h4>
          <div className="space-y-2">
            <div className="flex items-center">
              {status.envVars.hasUrl ? (
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500 mr-2" />
              )}
              <span className="font-medium">VITE_SUPABASE_URL:</span>
              <span className="ml-2 text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                {status.envVars.hasUrl ? 'Configured' : 'Missing'}
              </span>
            </div>
            <div className="flex items-center">
              {status.envVars.hasKey ? (
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500 mr-2" />
              )}
              <span className="font-medium">VITE_SUPABASE_ANON_KEY:</span>
              <span className="ml-2 text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                {status.envVars.hasKey ? 'Configured' : 'Missing'}
              </span>
            </div>
            {status.envVars.url && (
              <div className="mt-2 p-3 bg-blue-50 rounded">
                <span className="text-sm font-medium">Supabase URL:</span>
                <div className="text-sm font-mono text-blue-800 break-all">
                  {status.envVars.url}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Current User */}
        {status.user && (
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-3">Current User</h4>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="space-y-1">
                <p><span className="font-medium">Email:</span> {status.user.email}</p>
                <p><span className="font-medium">User ID:</span> {status.user.id}</p>
                <p><span className="font-medium">Created:</span> {new Date(status.user.created_at).toLocaleString()}</p>
                <p><span className="font-medium">Last Sign In:</span> {status.user.last_sign_in_at ? new Date(status.user.last_sign_in_at).toLocaleString() : 'Never'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-4">
          <button
            onClick={checkConnection}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
          >
            <Loader2 className="w-4 h-4 mr-2" />
            Recheck Connection
          </button>
          <button
            onClick={() => window.location.href = '/admin'}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Go to Admin Panel
          </button>
        </div>

        {/* Bolt Message Explanation */}
        <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400">
          <div className="flex">
            <AlertCircle className="w-5 h-5 text-yellow-400 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <h5 className="font-medium text-yellow-800">About the Bolt Supabase Message</h5>
              <p className="text-sm text-yellow-700 mt-1">
                The "Need a new Supabase connection?" message is a standard Bolt notification that appears 
                when working with Supabase projects. It's not an error - just Bolt being helpful! 
                You can safely ignore it if your connection is working (which it appears to be).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectionCheck;