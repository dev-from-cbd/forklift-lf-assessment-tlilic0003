// Import React library for building components
import React from 'react';
// Import Stripe library for payment processing
import { loadStripe } from '@stripe/stripe-js';
// Import X icon from Lucide React for the close button
import { X } from 'lucide-react';

// Initialize Stripe with publishable key from environment variables
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Define props interface for the PaymentModal component
interface PaymentModalProps {
  isOpen: boolean; // Whether modal is open
  onClose: () => void; // Function to close modal
}

// PaymentModal component definition
const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose }) => {
  // Return null if modal is not open
  if (!isOpen) return null;

  // Function to handle payment process
  const handlePayment = async () => {
    try {
      // Load Stripe instance
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to load');

      // Call API to create checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Get session ID from response
      const session = await response.json();

      // Redirect to Stripe checkout
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      // Handle any errors from Stripe
      if (result.error) {
        console.error(result.error);
      }
    } catch (error) {
      console.error('Payment error:', error);
    }
  };

  // Modal UI rendering
  return (
    // Modal backdrop
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {/* Modal content */}
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        {/* Modal header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Access Full Course</h2>
          {/* Close button */}
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal body */}
        <div className="space-y-4">
          <p className="text-gray-600">
            Get full access to all questions and features for just $1.
          </p>

          {/* Features list */}
          <ul className="space-y-2">
            <li className="flex items-center">
              <span className="mr-2">✓</span>
              Access to all {72} questions
            </li>
            <li className="flex items-center">
              <span className="mr-2">✓</span>
              Track your progress
            </li>
            <li className="flex items-center">
              <span className="mr-2">✓</span>
              Multiple difficulty levels
            </li>
            <li className="flex items-center">
              <span className="mr-2">✓</span>
              Lifetime access
            </li>
          </ul>

          {/* Payment button */}
          <button
            onClick={handlePayment}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Pay $1 to Access Full Course
          </button>

          {/* Payment security notice */}
          <p className="text-xs text-gray-500 text-center">
            Secure payment powered by Stripe
          </p>
        </div>
      </div>
    </div>
  );
};

// Export PaymentModal component
export default PaymentModal;