// Import Deno's HTTP server functionality
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
// Import Supabase client for database operations
import { createClient } from 'npm:@supabase/supabase-js';
// Import Stripe library for payment processing
import Stripe from 'npm:stripe';

// Initialize Stripe client with secret key from environment variables
const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16', // Specify Stripe API version
});

// Define CORS headers to allow cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Allow any origin
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type', // Allowed headers
};

// Create HTTP server to handle requests
serve(async (req) => {
  // Handle OPTIONS requests for CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'], // Accept only card payments
      line_items: [
        {
          price: Deno.env.get('STRIPE_PRICE_ID'), // Get price ID from environment
          quantity: 1, // Single item purchase
        },
      ],
      mode: 'payment', // One-time payment mode
      success_url: `${req.headers.get('origin')}/payment-success`, // Redirect URL after successful payment
      cancel_url: `${req.headers.get('origin')}/payment-cancelled`, // Redirect URL if payment cancelled
    });

    // Return session ID to client
    return new Response(
      JSON.stringify({ id: session.id }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200, // HTTP OK status
      },
    );
  } catch (error) {
    // Handle any errors that occur during checkout session creation
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500, // HTTP Internal Server Error status
      },
    );
  }
});