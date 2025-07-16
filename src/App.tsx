import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Forklift, ChevronLeft, ChevronRight, LogIn, LogOut, UserPlus, User, Shield } from 'lucide-react';
import QuestionPage from './components/QuestionPage';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import ResetPasswordForm from './components/ResetPasswordForm';
import ResetPasswordConfirm from './components/ResetPasswordConfirm';
import AuthCallback from './components/AuthCallback';
import AdminPanel from './components/AdminPanel';
import UserProfile from './components/UserProfile';
import OfflineIndicator from './components/OfflineIndicator';
import AuthLayout from './components/AuthLayout';
import DatabaseStatus from './components/DatabaseStatus';
import { useAuth } from './contexts/AuthContext';
import { supabase } from './config/supabase';
import { useState, useEffect } from 'react';

function App() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        setIsAdmin(roleData?.role === 'admin');
      }
    };

    checkAdminStatus();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleHeaderClick = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div 
        className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white py-8"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("https://images.unsplash.com/photo-1620472926326-0fc8946c880d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        }}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div 
              className="flex items-center cursor-pointer hover:opacity-90 transition-opacity"
              onClick={handleHeaderClick}
            >
              <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm mr-4">
                <Forklift size={40} className="text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight">
                  Forklift Training & Assessment
                </h1>
                <h2 className="text-xl mt-2 text-blue-100">
                  TLILIC0004 Licence to Operate an Order Picking Forklift Truck (LO)
                </h2>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => navigate('/profile')}
                    className="flex items-center px-6 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-lg transition-colors duration-200"
                  >
                    <User className="w-5 h-5 mr-2" />
                    <span>{user.email}</span>
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => navigate('/admin')}
                      className="flex items-center px-6 py-2.5 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors duration-200"
                    >
                      <Shield className="w-5 h-5 mr-2" />
                      <span>Admin Panel</span>
                    </button>
                  )}
                  <button
                    onClick={handleSignOut}
                    className="flex items-center px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200"
                  >
                    <LogOut className="w-5 h-5 mr-2" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => navigate('/login')}
                    className="flex items-center px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                  >
                    <LogIn className="w-5 h-5 mr-2" />
                    <span>Log in</span>
                  </button>
                  <button
                    onClick={() => navigate('/register')}
                    className="flex items-center px-8 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
                  >
                    <UserPlus className="w-5 h-5 mr-2" />
                    <span>Sign up</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/reset-password" element={<ResetPasswordForm />} />
            <Route path="/auth/reset-password-confirm" element={<ResetPasswordConfirm />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/admin" element={
              <AuthLayout requireAuth requireAdmin>
                <AdminPanel />
              </AuthLayout>
            } />
            <Route path="/profile" element={
              <AuthLayout requireAuth>
                <UserProfile />
              </AuthLayout>
            } />
            <Route path="/" element={<QuestionPage questionNumber={1} />} />
            <Route path="/question/:id" element={<QuestionPage />} />
            <Route path="/status" element={<DatabaseStatus />} />
          </Routes>
        </div>
      </div>

      <footer className="bg-gray-800 text-white py-4 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} Forklift Training & Assessment - TLILIC0004 Licence to Operate an Order Picking Forklift Truck (LO)</p>
        </div>
      </footer>
      
      <OfflineIndicator />
    </div>
  );
}

export default App;