// Import React and useEffect hook for component lifecycle management
import React, { useEffect } from 'react';
// Import useNavigate hook for programmatic navigation
import { useNavigate } from 'react-router-dom';
// Import Check icon from lucide-react icon library
import { Check } from 'lucide-react';

// Define PaymentSuccess component as a functional component
const PaymentSuccess: React.FC = () => {
  // Initialize the navigate function from useNavigate hook
  const navigate = useNavigate();

  // Use effect hook to create a redirect timer when component mounts
  useEffect(() => {
    // Set a timer to redirect to home page after 5 seconds (5000ms)
    const timer = setTimeout(() => {
      navigate('/'); // Navigate to the home page
    }, 5000);

    // Cleanup function to clear the timeout when component unmounts
    return () => clearTimeout(timer);
  }, [navigate]); // Dependency array with navigate to prevent unnecessary effect reruns

  // Return JSX for rendering the payment success message
  return (
    // Main container with minimum height and centered content
    <div className="min-h-[400px] flex items-center justify-center">
      {/* Content container with centered text and spacing between elements */}
      <div className="text-center space-y-4">
        {/* Success icon container - green circle with check icon */}
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          {/* Check icon with green color */}
          <Check className="w-8 h-8 text-green-600" />
        </div>
        {/* Success message heading */}
        <h2 className="text-2xl font-bold">Payment Successful!</h2>
        {/* Confirmation message about purchase */}
        <p className="text-gray-600">
          Thank you for your purchase. You now have full access to all questions.
        </p>
        {/* Redirect notification with smaller text */}
        <p className="text-sm text-gray-500">
          Redirecting you back to the course...
        </p>
      </div>
    </div>
  );
};

// Export the PaymentSuccess component as the default export
export default PaymentSuccess;