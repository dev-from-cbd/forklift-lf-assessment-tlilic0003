// Import React library for creating components
import React from 'react';
// Import loadStripe function from Stripe's JavaScript library
import { loadStripe } from '@stripe/stripe-js';
// Import X (close) icon from lucide-react icon library
import { X } from 'lucide-react';

// Initialize Stripe with the publishable key from environment variables
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Interface defining the props for the PaymentModal component
interface PaymentModalProps {
  isOpen: boolean; // Boolean flag indicating whether the modal is open or closed
  onClose: () => void; // Function to call when the modal should be closed
}

// Define the PaymentModal component as a functional component with PaymentModalProps
const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose }) => {
  // If modal is not open, don't render anything (early return pattern)
  if (!isOpen) return null;

  // Function to handle the payment process when user clicks the payment button
  const handlePayment = async () => {
    try {
      // Await the Stripe promise to resolve and get the Stripe instance
      const stripe = await stripePromise;
      // If Stripe failed to load, throw an error
      if (!stripe) throw new Error('Stripe failed to load');

      // Make API call to create a checkout session on the server
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST', // Using POST method
        headers: {
          'Content-Type': 'application/json', // Set content type header
        },
      });

      // Parse the JSON response to get the session
      const session = await response.json();

      // Redirect to Stripe checkout page using the session ID
      const result = await stripe.redirectToCheckout({
        sessionId: session.id, // Pass the session ID from the server
      });

      // Handle any errors from the redirect
      if (result.error) {
        console.error(result.error);
      }
    } catch (error) {
      // Log any errors that occur during the payment process
      console.error('Payment error:', error);
    }
  };

  // Return the JSX for the modal UI
  return (
    // Overlay that covers the entire screen with semi-transparent black background
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {/* Modal container with white background and rounded corners */}
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        {/* Header section with title and close button */}
        <div className="flex justify-between items-center mb-4">
          {/* Modal title */}
          <h2 className="text-2xl font-bold">Access Full Course</h2>
          {/* Close button that calls onClose prop when clicked */}
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            {/* X icon for close button */}
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal content container */}
        <div className="space-y-4">
          {/* Description text */}
          <p className="text-gray-600">
            Get full access to all questions and features for just $1.
          </p>

          {/* Features list */}
          <ul className="space-y-2">
            {/* Feature item - questions access */}
            <li className="flex items-center">
              <span className="mr-2">✓</span>
              Access to all {72} questions
            </li>
            {/* Feature item - progress tracking */}
            <li className="flex items-center">
              <span className="mr-2">✓</span>
              Track your progress
            </li>
            {/* Feature item - difficulty levels */}
            <li className="flex items-center">
              <span className="mr-2">✓</span>
              Multiple difficulty levels
            </li>
            {/* Feature item - lifetime access */}
            <li className="flex items-center">
              <span className="mr-2">✓</span>
              Lifetime access
            </li>
          </ul>

          {/* Payment button that calls handlePayment function when clicked */}
          <button
            onClick={handlePayment}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Pay $1 to Access Full Course
          </button>

          {/* Footer text with Stripe branding */}
          <p className="text-xs text-gray-500 text-center">
            Secure payment powered by Stripe
          </p>
        </div>
      </div>
    </div>
  );
};

// Export the PaymentModal component as the default export
export default PaymentModal;