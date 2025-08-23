// Import React library and useEffect hook for side effects
import React, { useEffect } from 'react';
// Import useNavigate hook for programmatic navigation
import { useNavigate } from 'react-router-dom';
// Import Check icon from lucide-react for success indicator
import { Check } from 'lucide-react';

// Define PaymentSuccess functional component
const PaymentSuccess: React.FC = () => {
  // Get navigate function for routing
  const navigate = useNavigate();

  // useEffect hook to handle automatic redirection after payment success
  useEffect(() => {
    // Set timer to redirect to home page after 5 seconds
    const timer = setTimeout(() => {
      // Navigate to home page
      navigate('/');
    }, 5000);

    // Cleanup function to clear timer when component unmounts
    return () => clearTimeout(timer);
  }, [navigate]); // Dependency array with navigate function

  // Return JSX for payment success page
  return (
    // Main container with minimum height and centered content
    <div className="min-h-[400px] flex items-center justify-center">
      {/* Content wrapper with centered text and vertical spacing */}
      <div className="text-center space-y-4">
        {/* Success icon container with green background */}
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          {/* Check icon indicating successful payment */}
          <Check className="w-8 h-8 text-green-600" />
        </div>
        {/* Main heading for payment success */}
        <h2 className="text-2xl font-bold">Payment Successful!</h2>
        {/* Thank you message with purchase confirmation */}
        <p className="text-gray-600">
          Thank you for your purchase. You now have full access to all questions.
        </p>
        {/* Redirection notice for user */}
        <p className="text-sm text-gray-500">
          Redirecting you back to the course...
        </p>
      </div>
    </div>
  );
};

// Export PaymentSuccess component as default export
export default PaymentSuccess;