// Import React and its hooks for component creation and state management
import React, { useState, useEffect } from 'react';
// Import authentication context to access user data
import { useAuth } from '../contexts/AuthContext';
// Import Supabase client for database operations
import { supabase } from '../config/supabase';
// Import icons from Lucide React library for UI elements
import { 
  Share2, // Icon for sharing functionality
  DollarSign, // Icon for monetary values
  Users, // Icon for user/referral counts
  Copy, // Icon for copy to clipboard functionality
  CheckCircle, // Icon for confirmation/success states
  TrendingUp, // Icon for trending/increasing values
  Gift, // Icon for rewards/bonuses
  Loader2, // Icon for loading states
  AlertCircle, // Icon for alerts/errors
  ExternalLink // Icon for external links
} from 'lucide-react';

// Interface defining the structure of referral data
interface ReferralData {
  code: string; // Unique referral code for the user
  total_referrals: number; // Total number of successful referrals
  total_earnings: number; // Total amount earned from all referrals
  available_earnings: number; // Amount currently available for withdrawal
  pending_earnings: number; // Amount pending confirmation/processing
}

// Interface defining the structure of individual referral earnings
interface ReferralEarning {
  id: string; // Unique identifier for the earning record
  earning_amount: number; // Amount earned from this specific referral
  earning_date: string; // Date when the earning was recorded
  status: string; // Status of the earning (available, pending, etc.)
  course_id: string; // ID of the course purchased through referral
  sale_id: string; // ID of the sale record
  // Optional fields that might not be returned from the database
  course_title?: string; // Title of the course purchased through referral
  buyer_email?: string; // Email of the user who made the purchase
}

// Define the ReferralDashboard functional component
const ReferralDashboard: React.FC = () => {
  // Get the current authenticated user from AuthContext
  const { user } = useAuth();
  // State for storing the user's referral data (code, earnings, etc.)
  const [referralData, setReferralData] = useState<ReferralData | null>(null);
  // State for storing detailed earnings history
  const [earnings, setEarnings] = useState<ReferralEarning[]>([]);
  // State for tracking loading status during data fetching
  const [loading, setLoading] = useState(true);
  // State for tracking whether the referral link has been copied to clipboard
  const [copied, setCopied] = useState(false);
  // State for storing any error messages
  const [error, setError] = useState('');

  // Effect hook to fetch referral data when the component mounts or user changes
  useEffect(() => {
    // Only fetch data if a user is authenticated
    if (user) {
      fetchReferralData();
    }
  }, [user]); // Re-run effect when user changes

  // Function to fetch all referral-related data for the current user
  const fetchReferralData = async () => {
    try {
      // Set loading state to true while fetching data
      setLoading(true);
      // Clear any previous errors
      setError('');

      // Get referral code and stats from the database
      const { data: codeData, error: codeError } = await supabase
        .from('referral_codes') // Query the referral_codes table
        .select('*') // Select all columns
        .eq('user_id', user?.id) // Filter by the current user's ID
        .single(); // Expect a single result

      // Handle errors, but ignore PGRST116 (no rows returned) as we'll create a code in that case
      if (codeError && codeError.code !== 'PGRST116') {
        throw codeError;
      }

      // If no referral code exists for this user, create one
      if (!codeData) {
        const { data: newCode, error: createError } = await supabase
          .from('referral_codes') // Target the referral_codes table
          .insert({ user_id: user?.id }) // Insert a new record with the user's ID
          .select() // Return the inserted record
          .single(); // Get it as a single object

        // Handle any errors during creation
        if (createError) throw createError;
        
        // Set initial referral data with the new code and zero values
        setReferralData({
          code: newCode.code, // The generated referral code
          total_referrals: 0, // No referrals yet
          total_earnings: 0, // No earnings yet
          available_earnings: 0, // No available earnings
          pending_earnings: 0 // No pending earnings
        });
      } else {
        // If a referral code exists, get the earnings breakdown
        const { data: earningsData } = await supabase
          .from('referral_earnings') // Query the referral_earnings table
          .select('earning_amount, status') // Select only the amount and status
          .eq('user_id', user?.id); // Filter by the current user's ID

        // Calculate available earnings (sum of all earnings with 'available' status)
        const available = earningsData?.filter(e => e.status === 'available')
          .reduce((sum, e) => sum + parseFloat(e.earning_amount), 0) || 0;
        
        // Calculate pending earnings (sum of all earnings with 'pending' status)
        const pending = earningsData?.filter(e => e.status === 'pending')
          .reduce((sum, e) => sum + parseFloat(e.earning_amount), 0) || 0;

        // Set referral data with existing code and calculated values
        setReferralData({
          code: codeData.code, // The existing referral code
          total_referrals: codeData.total_referrals, // Total number of referrals
          total_earnings: parseFloat(codeData.total_earnings), // Total earnings (convert to number)
          available_earnings: available, // Available earnings for withdrawal
          pending_earnings: pending // Pending earnings awaiting confirmation
        });
      }

      // Get detailed earnings history
      const { data: detailedEarnings } = await supabase
        .from('referral_earnings') // Query the referral_earnings table
        .select(`
          id,
          earning_amount,
          earning_date,
          status,
          course_id,
          sale_id
        `) // Select specific columns needed for the earnings history
        .eq('user_id', user?.id) // Filter by the current user's ID
        .order('earning_date', { ascending: false }); // Order by date, newest first

      // Update earnings state with the detailed earnings data
      setEarnings(detailedEarnings || []);

    } catch (err) {
      // Log any errors to the console
      console.error('Error fetching referral data:', err);
      // Set a user-friendly error message
      setError('Failed to load referral data');
    } finally {
      // Set loading to false regardless of success or failure
      setLoading(false);
    }
  };

  // Function to copy the user's referral link to clipboard
  const copyReferralLink = () => {
    if (referralData) {
      // Construct the full referral link with the current domain and user's referral code
      const referralLink = `${window.location.origin}/register?ref=${referralData.code}`;
      // Use the clipboard API to copy the link
      navigator.clipboard.writeText(referralLink);
      // Set copied state to true to show feedback to the user
      setCopied(true);
      // Reset the copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Function to share the referral link using the Web Share API or fallback to copying
  const shareReferralLink = () => {
    if (referralData) {
      // Construct the full referral link with the current domain and user's referral code
      const referralLink = `${window.location.origin}/register?ref=${referralData.code}`;
      const text = `Join this amazing forklift training platform and start learning! Use my referral link: ${referralLink}`;
      
      // Check if the Web Share API is available in the browser
      if (navigator.share) {
        // Use the Web Share API to open the native sharing dialog
        navigator.share({
          title: 'Forklift Training Platform',
          text: text,
          url: referralLink
        });
      } else {
        // Fallback to copying the link if Web Share API is not available
        copyReferralLink();
      }
    }
  };

  // Render loading state while data is being fetched
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600 mr-2" />
        <span>Loading referral dashboard...</span>
      </div>
    );
  }

  // Render error state if there was a problem fetching data
  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center">
        <AlertCircle className="w-5 h-5 mr-2" />
        {error}
      </div>
    );
  }

  // Main component render when data is loaded successfully
  return (
    // Main container with maximum width and auto margins
    <div className="max-w-6xl mx-auto p-6">
      {/* Header section with title and total earnings */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Share2 className="w-8 h-8 mr-3 text-green-600" /> {/* Share icon */}
              Referral Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Earn 10% commission when people you refer create paid courses!
            </p>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">
              ${referralData?.total_earnings.toFixed(2) || '0.00'}
            </div>
            <div className="text-sm text-gray-500">Total Earned</div>
          </div>
        </div>
      </div>

      {/* Stats Cards - Grid layout with responsive columns */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Total Referrals Card */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-600" /> {/* Users icon for referrals */}
            <div className="ml-4">
              <p className="text-sm font-medium text-blue-600">Total Referrals</p>
              <p className="text-2xl font-bold text-blue-900">
                {referralData?.total_referrals || 0} {/* Display total referrals count with fallback to 0 */}
              </p>
            </div>
          </div>
        </div>

        {/* Available Earnings Card */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <DollarSign className="w-8 h-8 text-green-600" /> {/* Dollar sign icon for earnings */}
            <div className="ml-4">
              <p className="text-sm font-medium text-green-600">Available</p>
              <p className="text-2xl font-bold text-green-900">
                ${referralData?.available_earnings.toFixed(2) || '0.00'} {/* Format available earnings as currency */}
              </p>
            </div>
          </div>
        </div>

        {/* Pending Earnings Card */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-yellow-600" /> {/* Trending up icon for pending earnings */}
            <div className="ml-4">
              <p className="text-sm font-medium text-yellow-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-900">
                ${referralData?.pending_earnings.toFixed(2) || '0.00'} {/* Format pending earnings as currency */}
              </p>
            </div>
          </div>
        </div>

        {/* Commission Rate Card */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <Gift className="w-8 h-8 text-purple-600" /> {/* Gift icon for commission rate */}
            <div className="ml-4">
              <p className="text-sm font-medium text-purple-600">Commission Rate</p>
              <p className="text-2xl font-bold text-purple-900">10%</p> {/* Fixed commission rate */}
            </div>
          </div>
        </div>
      </div>

      {/* Referral Link Section - Contains the user's unique referral link and sharing options */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Your Referral Link</h2>
        <p className="text-gray-600 mb-4">
          Share this link with friends and earn 10% commission when they create paid courses!
        </p>
        
        {/* Referral link display and action buttons */}
        <div className="flex items-center space-x-4">
          {/* Display the full referral link in a code block */}
          <div className="flex-1 bg-gray-50 p-3 rounded-lg border">
            <code className="text-sm">
              {window.location.origin}/register?ref={referralData?.code}
            </code>
          </div>
          
          {/* Copy button with dynamic icon and text based on copied state */}
          <button
            onClick={copyReferralLink}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {copied ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" /> {/* Check icon when copied */}
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" /> {/* Copy icon when not copied */}
                Copy
              </>
            )}
          </button>
          
          {/* Share button to open native share dialog or fallback to copy */}
          <button
            onClick={shareReferralLink}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Share2 className="w-4 h-4 mr-2" /> {/* Share icon */}
            Share
          </button>
        </div>

        {/* Information box explaining how the referral program works */}
        {/* Information box explaining how the referral program works */}
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

      {/* Earnings History Section - Displays a table of past earnings */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Earnings History</h2>
        
        {/* Conditional rendering based on whether there are earnings to display */}
        {earnings.length === 0 ? (
          /* Empty state when no earnings are available */
          <div className="text-center py-8 text-gray-500">
            <DollarSign className="w-12 h-12 mx-auto mb-4 text-gray-300" /> {/* Dollar sign icon */}
            <p>No earnings yet</p>
            <p className="text-sm">Start sharing your referral link to earn commissions!</p>
          </div>
        ) : (
          /* Table displaying earnings history when earnings are available */
          <div className="overflow-x-auto">
            <table className="w-full">
              {/* Table header */}
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
              {/* Table body with earnings data */}
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Map through each earning to create a table row */}
                {earnings.map((earning) => (
                  <tr key={earning.id}>
                    {/* Date column - formatted as locale date string */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(earning.earning_date).toLocaleDateString()}
                    </td>
                    {/* Amount column - formatted as currency */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      ${earning.earning_amount.toFixed(2)}
                    </td>
                    {/* Status column - with color-coded badge based on status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        earning.status === 'available' ? 'bg-green-100 text-green-800' : /* Green for available */
                        earning.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : /* Yellow for pending */
                        'bg-gray-100 text-gray-800' /* Gray for other statuses */
                      }`}>
                        {earning.status}
                      </span>
                    </td>
                    {/* Course column - showing the course name */}
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