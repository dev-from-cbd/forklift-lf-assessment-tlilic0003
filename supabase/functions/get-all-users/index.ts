// Import the serve function from Deno's standard HTTP server library
// Note: TypeScript errors for Deno imports are normal in a Deno environment
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
// Import the Supabase client creation function from the npm package
// Note: The npm: prefix is a Deno feature for importing npm packages
import { createClient } from 'npm:@supabase/supabase-js'

// Define CORS headers to allow cross-origin requests
const corsHeaders = {
  // Allow requests from any origin
  'Access-Control-Allow-Origin': '*',
  // Specify allowed headers for CORS requests
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Start the HTTP server with an async request handler
serve(async (req) => {
  // Handle preflight CORS requests
  if (req.method === 'OPTIONS') {
    // Return OK response with CORS headers for preflight requests
    return new Response('ok', { headers: corsHeaders })
  }

  // Start try-catch block for error handling
  try {
    // Create a Supabase client with the service role key for admin operations
    const supabaseAdmin = createClient(
      // Get Supabase URL from environment variables, fallback to empty string
      // Note: Deno is a global object in the Deno runtime environment
      Deno.env.get('SUPABASE_URL') ?? '',
      // Get service role key from environment variables, fallback to empty string
      // Note: Deno.env provides access to environment variables in Deno
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        // Configure authentication settings
        auth: {
          // Disable automatic token refresh
          autoRefreshToken: false,
          // Disable session persistence
          persistSession: false
        }
      }
    )

    // Extract the authorization header from the request
    const authHeader = req.headers.get('Authorization')
    // Check if authorization header is present
    if (!authHeader) {
      // Throw error if no authorization header is found
      throw new Error('No authorization header')
    }

    // Extract the JWT token by removing 'Bearer ' prefix from authorization header
    const token = authHeader.replace('Bearer ', '')
    // Verify the user authentication using the extracted token
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    
    // Check if authentication failed or user doesn't exist
    if (authError || !user) {
      // Throw unauthorized error if authentication fails
      throw new Error('Unauthorized')
    }

    // Query the user_roles table to check if user has admin privileges
    const { data: roleData, error: roleError } = await supabaseAdmin
      // Select from the user_roles table
      .from('user_roles')
      // Select only the role column
      .select('role')
      // Filter by the authenticated user's ID
      .eq('user_id', user.id)
      // Expect a single result
      .single()

    // Check if role query failed or user is not an admin
    if (roleError || roleData?.role !== 'admin') {
      // Throw error if user doesn't have admin access
      throw new Error('Admin access required')
    }

    // Fetch all users from the authentication system using admin privileges
    const { data: users, error: usersError } = await supabaseAdmin.auth.admin.listUsers()

    // Check if there was an error fetching users
    if (usersError) {
      // Re-throw the error if user fetching failed
      throw usersError
    }

    // Transform user data to include only necessary fields
    const userData = users.users.map(user => ({
      // User's unique identifier
      id: user.id,
      // User's email address
      email: user.email,
      // Timestamp when user account was created
      created_at: user.created_at,
      // Timestamp when email was confirmed
      email_confirmed_at: user.email_confirmed_at,
      // Timestamp of user's last sign-in
      last_sign_in_at: user.last_sign_in_at,
      // Timestamp when user data was last updated
      updated_at: user.updated_at
    }))

    // Return successful response with user data
    return new Response(
      // Convert user data to JSON string
      JSON.stringify(userData),
      {
        // Set response headers including CORS and content type
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        // Set HTTP status code to 200 (OK)
        status: 200,
      },
    )
  // Catch any errors that occur during execution
  } catch (error) {
    // Return error response
    return new Response(
      // Convert error message to JSON string
      JSON.stringify({ error: error.message }),
      {
        // Set response headers including CORS and content type
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        // Set HTTP status code to 400 (Bad Request)
        status: 400,
      },
    )
  // End of try-catch block
  }
// End of serve function
})