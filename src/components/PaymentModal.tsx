// Import React library for creating components
import React from 'react';
// Import loadStripe function from Stripe SDK for payment processing
import { loadStripe } from '@stripe/stripe-js';
// Import X icon from lucide-react for close button
import { X } from 'lucide-react';

// Initialize Stripe with publishable key from environment variables
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Define interface for PaymentModal component props
interface PaymentModalProps {
  // Boolean to control modal visibility
  isOpen: boolean;
  // Function to handle modal closing
  onClose: () => void;
}

// Define PaymentModal functional component with props destructuring
const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose }) => {
  // Return null if modal is not open (conditional rendering)
  if (!isOpen) return null;

  // Async function to handle payment processing
  const handlePayment = async () => {
    try {
      // Wait for Stripe to load from the promise
      const stripe = await stripePromise;
      // Throw error if Stripe failed to load
      if (!stripe) throw new Error('Stripe failed to load');

      // Make POST request to create checkout session
      const response = await fetch('/api/create-checkout-session', {
        // Set HTTP method to POST
        method: 'POST',
        // Set request headers
        headers: {
          // Specify content type as JSON
          'Content-Type': 'application/json',
        },
      });

      // Parse response as JSON to get session data
      const session = await response.json();

      // Redirect to Stripe checkout with session ID
      const result = await stripe.redirectToCheckout({
        // Use session ID from API response
        sessionId: session.id,
      });

      // Log error if checkout redirection failed
      if (result.error) {
        console.error(result.error);
      }
    } catch (error) {
      // Log any errors that occur during payment process
      console.error('Payment error:', error);
    }
  };

  // Return JSX for modal component
  return (
    // Modal overlay with dark background covering full screen
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {/* Modal content container with white background and rounded corners */}
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        {/* Header section with title and close button */}
        <div className="flex justify-between items-center mb-4">
          {/* Main heading for the modal */}
          <h2 className="text-2xl font-bold">Access Full Course</h2>
          {/* Close button with X icon */}
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            {/* X icon for close button */}
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Main content area with spacing between elements */}
        <div className="space-y-4">
          {/* Description paragraph with pricing information */}
          <p className="text-gray-600">
            Get full access to all questions and features for just $1.
          </p>

          {/* Unordered list of features and benefits */}
          <ul className="space-y-2">
            {/* Feature item: Access to all questions */}
            <li className="flex items-center">
              {/* Checkmark icon */}
              <span className="mr-2">✓</span>
              Access to all {72} questions
            </li>
            {/* Feature item: Progress tracking */}
            <li className="flex items-center">
              {/* Checkmark icon */}
              <span className="mr-2">✓</span>
              Track your progress
            </li>
            {/* Feature item: Multiple difficulty levels */}
            <li className="flex items-center">
              {/* Checkmark icon */}
              <span className="mr-2">✓</span>
              Multiple difficulty levels
            </li>
            {/* Feature item: Lifetime access */}
            <li className="flex items-center">
              {/* Checkmark icon */}
              <span className="mr-2">✓</span>
              Lifetime access
            </li>
          </ul>

          {/* Payment button that triggers handlePayment function */}
          <button
            onClick={handlePayment}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Pay $1 to Access Full Course
          </button>

          {/* Security notice paragraph */}
          <p className="text-xs text-gray-500 text-center">
            Secure payment powered by Stripe
          </p>
        </div>
        {/* End of modal content container */}
      </div>
      {/* End of modal overlay */}
    </div>
  );
};

// Export PaymentModal component as default export
export default PaymentModal;