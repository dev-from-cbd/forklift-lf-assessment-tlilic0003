// Declare global Deno namespace for TypeScript compatibility in Edge Functions
declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

// Import the serve function from Deno's standard HTTP server module to handle HTTP requests
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
// Import createClient function from Supabase JavaScript client library for database operations
import { createClient } from 'npm:@supabase/supabase-js';
// Import Stripe library for payment processing functionality
import Stripe from 'npm:stripe';

// Initialize Stripe instance with secret key from environment variables and API version
const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  // Specify the Stripe API version to ensure consistent behavior
  apiVersion: '2023-10-16',
});

// Define CORS headers to allow cross-origin requests from any domain
const corsHeaders = {
  // Allow requests from any origin (wildcard)
  'Access-Control-Allow-Origin': '*',
  // Specify which headers are allowed in cross-origin requests
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Start the HTTP server with an async request handler function
serve(async (req) => {
  // Handle preflight OPTIONS requests for CORS
  if (req.method === 'OPTIONS') {
    // Return OK response with CORS headers for preflight requests
    return new Response('ok', { headers: corsHeaders });
  }

  // Wrap the main logic in try-catch block for error handling
  try {
    // Create a new Stripe checkout session with payment configuration
    const session = await stripe.checkout.sessions.create({
      // Specify accepted payment methods (only card payments)
      payment_method_types: ['card'],
      // Define the items to be purchased in the checkout session
      line_items: [
        {
          // Get the Stripe price ID from environment variables
          price: Deno.env.get('STRIPE_PRICE_ID'),
          // Set quantity to 1 item
          quantity: 1,
        },
      ],
      // Set payment mode to one-time payment (not subscription)
      mode: 'payment',
      // Define success redirect URL using the request origin
      success_url: `${req.headers.get('origin')}/payment-success`,
      // Define cancel redirect URL using the request origin
      cancel_url: `${req.headers.get('origin')}/payment-cancelled`,
    });

    // Return successful response with the session ID
    return new Response(
      // Convert session ID to JSON string for the response body
      JSON.stringify({ id: session.id }),
      {
        // Merge CORS headers with Content-Type header
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        // Set HTTP status code to 200 (OK)
        status: 200,
      },
    );
  } catch (error) {
    // Handle any errors that occur during session creation
    return new Response(
      // Convert error message to JSON string for the response body
      JSON.stringify({ error: error.message }),
      {
        // Merge CORS headers with Content-Type header for error response
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        // Set HTTP status code to 500 (Internal Server Error)
        status: 500,
      },
    );
  }
// End of the serve function
});