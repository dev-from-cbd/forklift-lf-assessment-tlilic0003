import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../config/supabase';
import { 
  Share2, 
  DollarSign, 
  Users, 
  Copy, 
  CheckCircle,
  TrendingUp,
  Gift,
  Loader2,
  AlertCircle,
  ExternalLink
} from 'lucide-react';

interface ReferralData {
  code: string;
  total_referrals: number;
  total_earnings: number;
  available_earnings: number;
  pending_earnings: number;
}

interface ReferralEarning {
  id: string;
  earning_amount: number;
  earning_date: string;
  status: string;
  course_title: string;
  buyer_email: string;
}

const ReferralDashboard: React.FC = () => {
  const { user } = useAuth();
  const [referralData, setReferralData] = useState<ReferralData | null>(null);
  const [earnings, setEarnings] = useState<ReferralEarning[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      fetchReferralData();
    }
  }, [user]);

  const fetchReferralData = async () => {
    try {
      setLoading(true);
      setError('');

      // Get referral code and stats
      const { data: codeData, error: codeError } = await supabase
        .from('referral_codes')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (codeError && codeError.code !== 'PGRST116') {
        throw codeError;
      }

      // If no referral code exists, create one
      if (!codeData) {
        const { data: newCode, error: createError } = await supabase
          .from('referral_codes')
          .insert({ user_id: user?.id })
          .select()
          .single();

        if (createError) throw createError;
        setReferralData({
          code: newCode.code,
          total_referrals: 0,
          total_earnings: 0,
          available_earnings: 0,
          pending_earnings: 0
        });
      } else {
        // Get earnings breakdown
        const { data: earningsData } = await supabase
          .from('referral_earnings')
          .select('earning_amount, status')
          .eq('user_id', user?.id);

        const available = earningsData?.filter(e => e.status === 'available')
          .reduce((sum, e) => sum + parseFloat(e.earning_amount), 0) || 0;
        
        const pending = earningsData?.filter(e => e.status === 'pending')
          .reduce((sum, e) => sum + parseFloat(e.earning_amount), 0) || 0;

        setReferralData({
          code: codeData.code,
          total_referrals: codeData.total_referrals,
          total_earnings: parseFloat(codeData.total_earnings),
          available_earnings: available,
          pending_earnings: pending
        });
      }

      // Get detailed earnings
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

      setEarnings(detailedEarnings || []);

    } catch (err) {
      console.error('Error fetching referral data:', err);
      setError('Failed to load referral data');
    } finally {
      setLoading(false);
    }
  };

  const copyReferralLink = () => {
    if (referralData) {
      const referralLink = `${window.location.origin}/register?ref=${referralData.code}`;
      navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareReferralLink = () => {
    if (referralData) {
      const referralLink = `${window.location.origin}/register?ref=${referralData.code}`;
      const text = `Join this amazing forklift training platform and start learning! Use my referral link: ${referralLink}`;
      
      if (navigator.share) {
        navigator.share({
          title: 'Forklift Training Platform',
          text: text,
          url: referralLink
        });
      } else {
        // Fallback to copying
        copyReferralLink();
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600 mr-2" />
        <span>Loading referral dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center">
        <AlertCircle className="w-5 h-5 mr-2" />
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Share2 className="w-8 h-8 mr-3 text-green-600" />
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-blue-600">Total Referrals</p>
              <p className="text-2xl font-bold text-blue-900">
                {referralData?.total_referrals || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <DollarSign className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-green-600">Available</p>
              <p className="text-2xl font-bold text-green-900">
                ${referralData?.available_earnings.toFixed(2) || '0.00'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-yellow-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-900">
                ${referralData?.pending_earnings.toFixed(2) || '0.00'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <Gift className="w-8 h-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-purple-600">Commission Rate</p>
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