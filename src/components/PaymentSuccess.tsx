// Import React and useEffect hook for component lifecycle management
import React, { useEffect } from 'react';
// Import useNavigate hook for programmatic navigation
import { useNavigate } from 'react-router-dom';
// Import Check icon from Lucide React
import { Check } from 'lucide-react';

// PaymentSuccess component definition
const PaymentSuccess: React.FC = () => {
  // Initialize navigation hook
  const navigate = useNavigate();

  // Effect hook for automatic redirect after payment success
  useEffect(() => {
    // Set timer for 5 seconds before redirecting
    const timer = setTimeout(() => {
      navigate('/'); // Navigate to home page
    }, 5000);

    // Cleanup function to clear timer if component unmounts
    return () => clearTimeout(timer);
  }, [navigate]); // Dependency array with navigate function

  // Component UI rendering
  return (
    // Main container with minimum height and centered content
    <div className="min-h-[400px] flex items-center justify-center">
      {/* Success message container */}
      <div className="text-center space-y-4">
        {/* Green checkmark circle */}
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        {/* Success heading */}
        <h2 className="text-2xl font-bold">Payment Successful!</h2>
        {/* Success message */}
        <p className="text-gray-600">
          Thank you for your purchase. You now have full access to all questions.
        </p>
        {/* Redirect notice */}
        <p className="text-sm text-gray-500">
          Redirecting you back to the course...
        </p>
      </div>
    </div>
  );
};

// Export PaymentSuccess component
export default PaymentSuccess;