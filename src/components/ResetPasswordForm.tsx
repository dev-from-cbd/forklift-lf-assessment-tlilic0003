import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2, KeyRound } from 'lucide-react';

const ResetPasswordForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setMessage('');
      setError('');
      setLoading(true);
      await resetPassword(email);
      setMessage('Check your email for password reset instructions');
    } catch (err) {
      setError('Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        {error && (
          <div className="text-sm text-red-600">
            {error}
          </div>
        )}
        {message && (
          <div className="text-sm text-green-600">
            {message}
          </div>
        )}
        
        <div>
          <input
            type="email"
            required
            className="w-full px-3 py-1.5 text-sm border rounded focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="text-xs text-center">
          <Link to="/login" className="text-blue-600 hover:text-blue-500">
            Back to login
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center px-3 py-1.5 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <KeyRound className="w-4 h-4 mr-2" />
              Reset Password
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordForm;