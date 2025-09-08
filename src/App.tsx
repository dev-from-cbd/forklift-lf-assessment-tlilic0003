// Import React library for JSX support
import React from 'react';
// Import routing components from react-router-dom for navigation
import { Routes, Route, useNavigate } from 'react-router-dom';
// Import icon components from lucide-react library for UI elements
import { Forklift, ChevronLeft, ChevronRight, LogIn, LogOut, UserPlus, User, Shield } from 'lucide-react';
// Import page components for assessment questions
import QuestionPage from './components/QuestionPage';
// Import authentication-related components
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import ResetPasswordForm from './components/ResetPasswordForm';
import ResetPasswordConfirm from './components/ResetPasswordConfirm';
import AuthCallback from './components/AuthCallback';
// Import admin functionality component
import AdminPanel from './components/AdminPanel';
// Import user profile component
import UserProfile from './components/UserProfile';
// Import offline status indicator component
import OfflineIndicator from './components/OfflineIndicator';
// Import authentication layout wrapper component
import AuthLayout from './components/AuthLayout';
// Import system status components
import DatabaseStatus from './components/DatabaseStatus';
import UnsubscribePage from './components/UnsubscribePage';
import ConnectionCheck from './components/ConnectionCheck';
// Import course management components
import CourseCreator from './components/CourseCreator';
import CourseBrowser from './components/CourseBrowser';
// Import informational page components
import AboutUs from './components/AboutUs';
import Team from './components/Team';
import ForInvestors from './components/ForInvestors';
import ContactForm from './components/ContactForm';
// Import additional feature components
import ReferralDashboard from './components/ReferralDashboard';
import TrainingCenterReviews from './components/TrainingCenterReviews';
import ResumeBuilder from './components/ResumeBuilder';
import JobBoard from './components/JobBoard';
// Import authentication context hook
import { useAuth } from './contexts/AuthContext';
// Import Supabase client for database operations
import { supabase } from './config/supabase';
// Import React hooks for state management and side effects
import { useState, useEffect } from 'react';
// Import additional icon components
import { Plus, BookOpen, Share2, Building, FileText, Users } from 'lucide-react';

/**
 * Main App component that serves as the root of the application
 * Handles routing, authentication state, and admin status checking
 */
function App() {
  // Initialize navigation function from react-router
  const navigate = useNavigate();
  // Get user object and signOut function from authentication context
  const { user, signOut } = useAuth();
  // State to track if current user has admin privileges
  const [isAdmin, setIsAdmin] = useState(false);

  // Effect hook to check admin status whenever user changes
  useEffect(() => {
    // Define async function to check if user has admin role
    const checkAdminStatus = async () => {
      if (user) {
        // Check by environment variable first - direct admin access via email
        if (user.email === import.meta.env.VITE_ADMIN_EMAIL) {
          setIsAdmin(true);
          return; // Exit early if admin email matches
        }
        
        // Query the database to check if user has admin role in user_roles table
        const { data: roleData } = await supabase
          .from('user_roles') // Access the user_roles table
          .select('role')     // Select only the role column
          .eq('user_id', user.id) // Filter by the current user's ID
          .single();          // Expect only one result

        // Set admin status based on role value from database
        setIsAdmin(roleData?.role === 'admin');
      }
    };

    // Call the function to check admin status
    checkAdminStatus();
  }, [user]); // Re-run effect when user changes

  /**
   * Handles user sign out process
   * Signs out the user and redirects to home page
   */
  const handleSignOut = async () => {
    try {
      // Call signOut function from auth context
      await signOut();
      // Redirect to home page after successful sign out
      navigate('/');
    } catch (error) {
      // Log any errors that occur during sign out
      console.error('Error signing out:', error);
    }
  };

  /**
   * Handles click on the header/logo area
   * Navigates user to the home page
   */
  const handleHeaderClick = () => {
    navigate('/');
  };

  // Render the application UI
  return (
    // Main container with minimum height and light background
    <div className="min-h-screen bg-gray-50">
      {/* Header section with background image and gradient overlay */}
      <div 
        className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white py-8"
        style={{
          // Background image with dark overlay for better text contrast
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("https://images.unsplash.com/photo-1620472926326-0fc8946c880d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80")',
          backgroundSize: 'cover', // Cover the entire area
          backgroundPosition: 'center', // Center the image
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' // Add subtle shadow
        }}
      >
        {/* Container for header content with horizontal padding */}
        <div className="container mx-auto px-4">
          {/* Flex container for logo and navigation buttons */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo and title section that navigates to home when clicked */}
            <div 
              className="flex items-center cursor-pointer hover:opacity-90 transition-opacity"
              onClick={handleHeaderClick}
            >
              {/* Forklift icon with semi-transparent background */}
              <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm mr-4">
                <Forklift size={40} className="text-white" />
              </div>
              {/* Title and subtitle text */}
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
              {/* Conditional rendering based on user authentication status */}
              {user ? (
                <div className="flex items-center gap-4">
                  {/* Profile button - displays user email and navigates to profile page */}
                  <button
                    onClick={() => navigate('/profile')}
                    className="flex items-center px-6 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-lg transition-colors duration-200"
                  >
                    <User className="w-5 h-5 mr-2" />
                    <span>{user.email}</span>
                  </button>
                  {/* Admin Panel button - only visible to users with admin privileges */}
                  {isAdmin && (
                    <button
                      onClick={() => navigate('/admin')}
                      className="flex items-center px-6 py-2.5 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors duration-200"
                    >
                      <Shield className="w-5 h-5 mr-2" />
                      <span>Admin Panel</span>
                    </button>
                  )}
                  {/* Sign Out button - triggers the handleSignOut function */}
                  <button
                    onClick={handleSignOut}
                    className="flex items-center px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200"
                  >
                    <LogOut className="w-5 h-5 mr-2" />
                    <span>Sign Out</span>
                  </button>
                  {/* Create Course button - navigates to course creation page */}
                  <button
                    onClick={() => navigate('/create-course')}
                    className="flex items-center px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    <span>Create Course</span>
                  </button>
                  {/* Browse Courses button - navigates to courses listing page */}
                  <button
                    onClick={() => navigate('/courses')}
                    className="flex items-center px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
                  >
                    <BookOpen className="w-5 h-5 mr-2" />
                    <span>Browse Courses</span>
                  </button>
                  {/* My Resume button - navigates to user's resume page */}
                  <button
                    onClick={() => navigate('/resume')}
                    className="flex items-center px-6 py-2.5 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors duration-200"
                  >
                    <FileText className="w-5 h-5 mr-2" />
                    <span>My Resume</span>
                  </button>
                </div>
              ) : (
                /* Navigation buttons for non-authenticated users */
                <div className="flex items-center gap-4">
                  {/* Log in button - navigates to login page */}
                  <button
                    onClick={() => navigate('/login')}
                    className="flex items-center px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                  >
                    <LogIn className="w-5 h-5 mr-2" />
                    <span>Log in</span>
                  </button>
                  {/* Sign up button - navigates to registration page */}
                  <button
                    onClick={() => navigate('/register')}
                    className="flex items-center px-8 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
                  >
                    <UserPlus className="w-5 h-5 mr-2" />
                    <span>Sign up</span>
                  </button>
                  {/* Browse Courses button - navigates to courses listing page */}
                  <button
                    onClick={() => navigate('/courses')}
                    className="flex items-center px-8 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors duration-200"
                  >
                    <BookOpen className="w-5 h-5 mr-2" />
                    <span>Browse Courses</span>
                  </button>
                  {/* Training Centers button - navigates to training centers reviews page */}
                  <button
                    onClick={() => navigate('/reviews')}
                    className="flex items-center px-8 py-2.5 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors duration-200"
                  >
                    <Building className="w-5 h-5 mr-2" />
                    <span>Training Centers</span>
                  </button>
                  {/* Find Talent button - navigates to job board page */}
                  <button
                    onClick={() => navigate('/job-board')}
                    className="flex items-center px-8 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors duration-200"
                  >
                    <Users className="w-5 h-5 mr-2" />
                    <span>Find Talent</span>
                  </button>
                  {/* Referrals button - navigates to referrals page */}
                  <button
                    onClick={() => navigate('/referrals')}
                    className="flex items-center px-8 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
                  >
                    <Share2 className="w-5 h-5 mr-2" />
                    <span>Referrals</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Application routing configuration */}
          <Routes>
            {/* Authentication routes */}
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/reset-password" element={<ResetPasswordForm />} />
            <Route path="/auth/reset-password-confirm" element={<ResetPasswordConfirm />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/unsubscribe" element={<UnsubscribePage />} />
            
            {/* Protected routes - require authentication */}
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
            <Route path="/create-course" element={
              <AuthLayout requireAuth>
                <CourseCreator />
              </AuthLayout>
            } />
            <Route path="/resume" element={
              <AuthLayout requireAuth>
                <ResumeBuilder />
              </AuthLayout>
            } />
            <Route path="/referrals" element={
              <AuthLayout requireAuth>
                <ReferralDashboard />
              </AuthLayout>
            } />
            
            {/* Public routes - accessible to all users */}
            <Route path="/courses" element={<CourseBrowser />} />
            <Route path="/reviews" element={<TrainingCenterReviews />} />
            <Route path="/job-board" element={<JobBoard />} />
            <Route path="/" element={<QuestionPage questionNumber={1} />} />
            <Route path="/question/:number" element={<QuestionPage />} />
            <Route path="/status" element={<DatabaseStatus />} />
            <Route path="/connection" element={<ConnectionCheck />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/team" element={<Team />} />
            <Route path="/investors" element={<ForInvestors />} />
            <Route path="/contact" element={<ContactForm />} />
          </Routes>
        </div>
      </div>

      {/* Footer section with site navigation and copyright information */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          {/* Footer navigation grid - responsive layout with 1 column on mobile, 4 columns on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-6">
            {/* Company information section */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => navigate('/about')}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    About Us
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/careers')}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Careers
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/blog')}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Blog
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/investors')}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Investors
                  </button>
                </li>
              </ul>
            </div>
            
            {/* Platform features section */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Platform</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => navigate('/courses')}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Courses
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/reviews')}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Training Centers
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/job-board')}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Find Talent
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/referrals')}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Referrals
                  </button>
                </li>
              </ul>
            </div>
            
            {/* Training courses section */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Training</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    TLILIC0003 Forklift
                  </button>
                </li>
                <li>
                  <button
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    TLILIC0004 Order Picker
                  </button>
                </li>
                <li>
                  <button
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    TLILIC0005 Mobile Crane
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/courses')}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    View All Courses
                  </button>
                </li>
              </ul>
            </div>
            
            {/* Contact information section */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => navigate('/contact')}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Contact Us
                  </button>
                </li>
                <li>
                  <button
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    support@forklifttraining.com
                  </button>
                </li>
                <li>
                  <button
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    1-800-FORKLIFT
                  </button>
                </li>
                <li>
                  <button
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    FAQ
                  </button>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Copyright section with current year */}
          <div className="border-t border-gray-700 pt-6">
            <p className="text-gray-400">
              © {new Date().getFullYear()} Forklift Training & Assessment - TLILIC0004 Licence to Operate an Order Picking Forklift Truck (LO)
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Revolutionizing professional education through AI-powered learning platforms
            </p>
          </div>
        </div>
      </footer>
      
      {/* Component to show offline status when internet connection is lost */}
      <OfflineIndicator />
    </div>
  );
}

/**
 * Export the App component as the default export
 * This makes it available for import in other files
 */
export default App;