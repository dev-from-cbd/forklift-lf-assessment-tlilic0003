// Import React library and hooks for state management and side effects
import React, { useState, useEffect } from 'react';
// Import authentication context hook
import { useAuth } from '../contexts/AuthContext';
// Import Supabase client for database operations
import { supabase } from '../config/supabase';
// Import various icons from Lucide React icon library
import { 
  Share2,      // Share icon for referral sharing
  DollarSign,  // Dollar sign icon for earnings
  Users,       // Users icon for referral count
  Copy,        // Copy icon for copying referral link
  CheckCircle, // Check circle icon for success states
  TrendingUp,  // Trending up icon for pending earnings
  Gift,        // Gift icon for commission rate
  Loader2,     // Loading spinner icon
  AlertCircle, // Alert circle icon for errors
  ExternalLink // External link icon
} from 'lucide-react';

// Interface defining the structure of referral data
interface ReferralData {
  code: string;                // Unique referral code
  total_referrals: number;     // Total number of successful referrals
  total_earnings: number;      // Total amount earned from referrals
  available_earnings: number;  // Earnings available for withdrawal
  pending_earnings: number;    // Earnings pending confirmation
}

// Interface defining the structure of individual referral earnings
interface ReferralEarning {
  id: string;           // Unique identifier for the earning record
  earning_amount: number; // Amount earned from this referral
  earning_date: string;   // Date when the earning was generated
  status: string;         // Status of the earning (pending, available, etc.)
  course_title: string;   // Title of the course that generated the earning
  buyer_email: string;    // Email of the person who made the purchase
}

// Main ReferralDashboard functional component
const ReferralDashboard: React.FC = () => {
  // Get current authenticated user from auth context
  const { user } = useAuth();
  // State for storing referral data (code, stats, earnings)
  const [referralData, setReferralData] = useState<ReferralData | null>(null);
  // State for storing array of individual earnings records
  const [earnings, setEarnings] = useState<ReferralEarning[]>([]);
  // State for tracking loading status
  const [loading, setLoading] = useState(true);
  // State for tracking if referral link was copied to clipboard
  const [copied, setCopied] = useState(false);
  // State for storing error messages
  const [error, setError] = useState('');

  // Effect hook to fetch referral data when user changes
  useEffect(() => {
    // Only fetch data if user is authenticated
    if (user) {
      // Call function to fetch referral data
      fetchReferralData();
    }
    // Re-run effect when user changes
  }, [user]);

  // Async function to fetch all referral-related data from database
  const fetchReferralData = async () => {
    try {
      // Set loading state to true
      setLoading(true);
      // Clear any previous errors
      setError('');

      // Query database to get existing referral code and statistics
      const { data: codeData, error: codeError } = await supabase
        .from('referral_codes')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      // Check for errors (ignore PGRST116 which means no rows found)
      if (codeError && codeError.code !== 'PGRST116') {
        throw codeError;
      }

      // If no referral code exists for this user, create a new one
      if (!codeData) {
        // Insert new referral code record for the user
        const { data: newCode, error: createError } = await supabase
          .from('referral_codes')
          .insert({ user_id: user?.id })
          .select()
          .single();

        // Throw error if code creation failed
        if (createError) throw createError;
        // Set initial referral data with new code and zero stats
        setReferralData({
          code: newCode.code,
          total_referrals: 0,
          total_earnings: 0,
          available_earnings: 0,
          pending_earnings: 0
        });
      } else {
        // If referral code exists, get detailed earnings breakdown
        const { data: earningsData } = await supabase
          .from('referral_earnings')
          .select('earning_amount, status')
          .eq('user_id', user?.id);

        // Calculate total available earnings by filtering and summing
        const available = earningsData?.filter(e => e.status === 'available')
          .reduce((sum, e) => sum + parseFloat(e.earning_amount), 0) || 0;
        
        // Calculate total pending earnings by filtering and summing
        const pending = earningsData?.filter(e => e.status === 'pending')
          .reduce((sum, e) => sum + parseFloat(e.earning_amount), 0) || 0;

        // Set referral data with existing code and calculated earnings
        setReferralData({
          code: codeData.code,
          total_referrals: codeData.total_referrals,
          total_earnings: parseFloat(codeData.total_earnings),
          available_earnings: available,
          pending_earnings: pending
        });
      }

      // Get detailed earnings history for display in table
      const { data: detailedEarnings } = await supabase
        .from('referral_earnings')
        .select(`
          id,
          earning_amount,
          earning_date,
          status,
          course_id,
          sale_id
        `)
        .eq('user_id', user?.id)
        .order('earning_date', { ascending: false });

      // Set earnings data (empty array if no data)
      setEarnings(detailedEarnings || []);

    } catch (err) {
      // Log error to console for debugging
      console.error('Error fetching referral data:', err);
      // Set user-friendly error message
      setError('Failed to load referral data');
    } finally {
      // Always set loading to false when done
      setLoading(false);
    }
  };

  // Function to copy referral link to clipboard
  const copyReferralLink = () => {
    // Check if referral data exists
    if (referralData) {
      // Construct full referral link with current domain and referral code
      const referralLink = `${window.location.origin}/register?ref=${referralData.code}`;
      // Copy link to clipboard using browser API
      navigator.clipboard.writeText(referralLink);
      // Set copied state to true for UI feedback
      setCopied(true);
      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Function to share referral link using native share API or fallback to copy
  const shareReferralLink = () => {
    // Check if referral data exists
    if (referralData) {
      // Construct full referral link with current domain and referral code
      const referralLink = `${window.location.origin}/register?ref=${referralData.code}`;
      // Create share text with referral link
      const text = `Join this amazing forklift training platform and start learning! Use my referral link: ${referralLink}`;
      
      // Check if browser supports native sharing
      if (navigator.share) {
        // Use native share API with title, text, and URL
        navigator.share({
          title: 'Forklift Training Platform',
          text: text,
          url: referralLink
        });
      } else {
        // Fallback to copying if native sharing not available
        copyReferralLink();
      }
    }
  };

  // Show loading spinner while data is being fetched
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        {/* Animated loading spinner icon */}
        <Loader2 className="w-6 h-6 animate-spin text-blue-600 mr-2" />
        {/* Loading message */}
        <span>Loading referral dashboard...</span>
      </div>
    );
  }

  // Show error message if data fetching failed
  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center">
        {/* Error alert icon */}
        <AlertCircle className="w-5 h-5 mr-2" />
        {/* Display error message */}
        {error}
      </div>
    );
  }

  // Main component render with referral dashboard layout
  return (
    // Main container with max width and padding
    <div className="max-w-6xl mx-auto p-6">
      {/* Header section with title and total earnings */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        {/* Flex container for header content */}
        <div className="flex items-center justify-between">
          {/* Left side: Title and description */}
          <div>
            {/* Main title with share icon */}
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              {/* Share icon for referral theme */}
              <Share2 className="w-8 h-8 mr-3 text-green-600" />
              Referral Dashboard
            </h1>
            {/* Description of referral program */}
            <p className="text-gray-600 mt-2">
              Earn 10% commission when people you refer create paid courses!
            </p>
          </div>
          
          {/* Right side: Total earnings display */}
          <div className="text-right">
            {/* Large earnings amount */}
            <div className="text-2xl font-bold text-green-600">
              ${referralData?.total_earnings.toFixed(2) || '0.00'}
            </div>
            {/* Label for earnings */}
            <div className="text-sm text-gray-500">Total Earned</div>
          </div>
        </div>
      </div>

      {/* Stats Cards section with 4 metric cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Total Referrals Card */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            {/* Users icon for referral count */}
            <Users className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              {/* Label for total referrals */}
              <p className="text-sm font-medium text-blue-600">Total Referrals</p>
              {/* Display total referrals count */}
              <p className="text-2xl font-bold text-blue-900">
                {referralData?.total_referrals || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Available Earnings Card */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            {/* Dollar sign icon for available earnings */}
            <DollarSign className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              {/* Label for available earnings */}
              <p className="text-sm font-medium text-green-600">Available</p>
              {/* Display available earnings amount */}
              <p className="text-2xl font-bold text-green-900">
                ${referralData?.available_earnings.toFixed(2) || '0.00'}
              </p>
            </div>
          </div>
        </div>

        {/* Pending Earnings Card */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            {/* Trending up icon for pending earnings */}
            <TrendingUp className="w-8 h-8 text-yellow-600" />
            <div className="ml-4">
              {/* Label for pending earnings */}
              <p className="text-sm font-medium text-yellow-600">Pending</p>
              {/* Display pending earnings amount */}
              <p className="text-2xl font-bold text-yellow-900">
                ${referralData?.pending_earnings.toFixed(2) || '0.00'}
              </p>
            </div>
          </div>
        </div>

        {/* Commission Rate Card */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            {/* Gift icon for commission rate */}
            <Gift className="w-8 h-8 text-purple-600" />
            <div className="ml-4">
              {/* Label for commission rate */}
              <p className="text-sm font-medium text-purple-600">Commission Rate</p>
              {/* Display fixed commission rate */}
              <p className="text-2xl font-bold text-purple-900">10%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Referral Link Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Your Referral Link</h2>
        <p className="text-gray-600 mb-4">
          Share this link with friends and earn 10% commission when they create paid courses!
        </p>
        
        <div className="flex items-center space-x-4">
          <div className="flex-1 bg-gray-50 p-3 rounded-lg border">
            <code className="text-sm">
              {window.location.origin}/register?ref={referralData?.code}
            </code>
          </div>
          
          <button
            onClick={copyReferralLink}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {copied ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </>
            )}
          </button>
          
          <button
            onClick={shareReferralLink}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </button>
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">How it works:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Share your referral link with friends</li>
            <li>• They sign up using your link</li>
            <li>• When they create a paid course, you earn 10% commission</li>
            <li>• Earnings are available for withdrawal once confirmed</li>
          </ul>
        </div>
      </div>

      {/* Earnings History */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Earnings History</h2>
        
        {earnings.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <DollarSign className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No earnings yet</p>
            <p className="text-sm">Start sharing your referral link to earn commissions!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {earnings.map((earning) => (
                  <tr key={earning.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(earning.earning_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      ${earning.earning_amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        earning.status === 'available' ? 'bg-green-100 text-green-800' :
                        earning.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {earning.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      Course Sale
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReferralDashboard;