import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Forklift, ChevronLeft, ChevronRight, LogIn, LogOut, UserPlus } from 'lucide-react';
import QuestionPage from './components/QuestionPage';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import ResetPasswordForm from './components/ResetPasswordForm';
import OfflineIndicator from './components/OfflineIndicator';
import AuthLayout from './components/AuthLayout';
import { useAuth } from './contexts/AuthContext';
import { questions } from './data/questions';

function App() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const totalPages = questions.length;

  const handleNavigation = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      navigate(`/question/${pageNumber}`);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div 
        className="bg-blue-900 text-white py-6"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("https://images.unsplash.com/photo-1620472926326-0fc8946c880d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Forklift size={40} className="mr-3" />
              <div>
                <h1 className="text-3xl font-bold">Forklift Training & Assessment</h1>
                <h2 className="text-xl opacity-90">TLILIC0003 High Risk Licence</h2>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm opacity-90">{user.email}</span>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate('/login')}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </button>
                  <button
                    onClick={() => navigate('/register')}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Register
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
            <Route path="/login" element={
              <div className="grid grid-cols-1 md:grid-cols-[1fr,300px] gap-6">
                <QuestionPage questionNumber={1} />
                <LoginForm />
              </div>
            } />
            <Route path="/register" element={
              <div className="grid grid-cols-1 md:grid-cols-[1fr,300px] gap-6">
                <QuestionPage questionNumber={1} />
                <RegisterForm />
              </div>
            } />
            <Route path="/reset-password" element={
              <div className="grid grid-cols-1 md:grid-cols-[1fr,300px] gap-6">
                <QuestionPage questionNumber={1} />
                <ResetPasswordForm />
              </div>
            } />
            <Route path="/" element={<QuestionPage questionNumber={1} />} />
            <Route path="/question/:id" element={<QuestionPage />} />
          </Routes>

          {user && (
            <div className="mt-8 flex justify-between items-center">
              <button
                onClick={() => handleNavigation(Number(window.location.pathname.split('/').pop() || 1) - 1)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ChevronLeft className="mr-2" size={20} />
                Previous
              </button>
              <span className="text-gray-600">
                Question {window.location.pathname.split('/').pop() || 1} of {totalPages}
              </span>
              <button
                onClick={() => handleNavigation(Number(window.location.pathname.split('/').pop() || 1) + 1)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next
                <ChevronRight className="ml-2" size={20} />
              </button>
            </div>
          )}
        </div>
      </div>

      <footer className="bg-gray-800 text-white py-4 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} Forklift Training & Assessment</p>
        </div>
      </footer>
      
      <OfflineIndicator />
    </div>
  );
}

export default App;