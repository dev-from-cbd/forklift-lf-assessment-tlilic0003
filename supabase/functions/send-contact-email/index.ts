// Import the serve function from Deno's standard HTTP server library
// Note: TypeScript errors for Deno imports are normal in a Deno environment
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
// Import the Supabase client creation function from the npm package
// Note: The npm: prefix is a Deno feature for importing npm packages
import { createClient } from 'npm:@supabase/supabase-js@2'

// Define CORS headers to allow cross-origin requests
const corsHeaders = {
  // Allow requests from any origin
  'Access-Control-Allow-Origin': '*',
  // Specify allowed headers for CORS requests
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  // Specify allowed HTTP methods for CORS requests
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

// Define TypeScript interface for contact form data structure
interface ContactFormData {
  // Contact person's full name
  name: string
  // Contact person's email address
  email: string
  // Subject line of the contact message
  subject: string
  // Main message content from the contact form
  message: string
  // Type/category of the contact inquiry
  type: string
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
    // Create a Supabase client with admin privileges for database operations
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

    // Parse the JSON request body into ContactFormData interface
    const formData: ContactFormData = await req.json()
    // Log the received contact form data for debugging purposes
    console.log('Received contact form submission:', formData)

    // Define the admin email address for contact notifications
    const adminEmail = 'neoguru@gmail.com'
    // Define the website URL for email template links
    const siteUrl = 'https://forklift-lo-tlilic0004.netlify.app'

    // Generate HTML version of the contact email using helper function
    const emailHtml = createContactEmailHtml(formData, siteUrl)
    // Generate plain text version of the contact email using helper function
    const emailText = createContactEmailText(formData)

    // Insert the contact message into admin_notifications table for admin review
    const { error: notificationError } = await supabaseAdmin
      // Select the admin_notifications table
      .from('admin_notifications')
      // Insert a new notification record
      .insert({
        // Set notification type as contact form submission
        type: 'contact_form_submission',
        // No specific user ID since this is from a contact form
        user_id: null,
        // Store the sender's email address
        user_email: formData.email,
        // Store comprehensive notification data as JSON
        notification_data: {
          // Include the original form data
          contact_form_data: formData,
          // Include the generated HTML email content
          email_html: emailHtml,
          // Include the generated plain text email content
          email_text: emailText,
          // Include the admin email for reference
          admin_email: adminEmail,
          // Record the submission timestamp
          submitted_at: new Date().toISOString(),
          // Capture user agent information for tracking
          user_agent: req.headers.get('user-agent') || 'Unknown'
        },
        // Mark notification as unread initially
        read: false,
        // Set the creation timestamp
        created_at: new Date().toISOString()
      })

    // Check if there was an error storing the notification
    if (notificationError) {
      // Log the error details for debugging
      console.error('Error storing contact notification:', notificationError)
      // Throw an error to trigger the catch block
      throw new Error('Failed to store contact message')
    }

    // Log successful storage for debugging purposes
    console.log('Contact form submission stored successfully')

    // Note: In a production environment, integrate with email service (SendGrid, etc.)
    // Currently storing in database for admin panel review
    
    // Return successful response to the client
    return new Response(
      // Convert success response object to JSON string
      JSON.stringify({ 
        // Indicate successful submission
        success: true, 
        // Provide user-friendly success message
        message: 'Contact form submitted successfully',
        // Inform that message is stored for admin review
        stored_in_admin_panel: true
      }),
      {
        // Set response headers including CORS and content type
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        // Set HTTP status code to 200 (OK)
        status: 200,
      },
    )

  // Catch any errors that occur during execution
  } catch (error) {
    // Log the error details for debugging
    console.error('Error in contact form function:', error)
    // Return error response to the client
    return new Response(
      // Convert error response object to JSON string
      JSON.stringify({ 
        // Indicate failed submission
        success: false, 
        // Provide error message (fallback if no specific message)
        error: error.message || 'Failed to submit contact form' 
      }),
      {
        // Set response headers including CORS and content type
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        // Set HTTP status code to 500 (Internal Server Error)
        status: 500,
      },
    )
  // End of try-catch block
  }
// End of serve function
})

// Function to generate HTML email content for contact form submissions
function createContactEmailHtml(formData: ContactFormData, siteUrl: string): string {
  // Define user-friendly labels for different contact form types
  const typeLabels = {
    // General inquiries and questions
    general: 'General Inquiry',
    // Investment-related opportunities
    investment: 'Investment Opportunity',
    // Partnership proposals
    partnership: 'Partnership',
    // Technical support requests
    support: 'Technical Support',
    // Job applications and team joining requests
    team: 'Join Our Team'
  }

  // Return the complete HTML email template as a string
  return `
    <!-- HTML5 doctype declaration -->
    <!DOCTYPE html>
    <html>
    <head>
      <!-- Set character encoding to UTF-8 -->
      <meta charset="utf-8">
      <!-- Set email title -->
      <title>New Contact Form Submission</title>
      <!-- Inline CSS styles for email compatibility -->
      <style>
        /* Base body styling for email clients */
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        /* Main container with max width and centering */
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        /* Header section with gradient background */
        .header { background: linear-gradient(135deg, #1e40af, #3730a3); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        /* Content area with light background */
        .content { background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; }
        /* Message boxes with white background and blue left border */
        .message-box { background: white; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #1e40af; }
        /* Footer styling with centered text */
        .footer { text-align: center; margin-top: 30px; padding: 20px; color: #666; font-size: 14px; border-top: 1px solid #e2e8f0; }
        /* Bold labels with blue color */
        .label { font-weight: bold; color: #1e40af; }
        /* Urgent styling with red background for important messages */
        .urgent { background: #fef2f2; border-left-color: #ef4444; }
      </style>
    </head>
    <!-- Email body content -->
    <body>
      <!-- Main email container -->
      <div class="container">
        <!-- Email header with branding -->
        <div class="header">
          <!-- Main heading with forklift emoji -->
          <h1>🚛 New Contact Form Submission</h1>
          <!-- Platform description -->
          <p>Forklift Training & Assessment Platform</p>
        </div>
        <!-- Main content area -->
        <div class="content">
          <!-- Contact details section heading -->
          <h2>📧 Contact Details</h2>
          
          <!-- Contact information box with conditional urgent styling -->
          <div class="message-box ${formData.type === 'investment' ? 'urgent' : ''}">
            <!-- Display contact form type with user-friendly label -->
            <p><span class="label">Type:</span> ${typeLabels[formData.type as keyof typeof typeLabels] || formData.type}</p>
            <!-- Display sender's name -->
            <p><span class="label">Name:</span> ${formData.name}</p>
            <!-- Display sender's email address -->
            <p><span class="label">Email:</span> ${formData.email}</p>
            <!-- Display message subject -->
            <p><span class="label">Subject:</span> ${formData.subject}</p>
            <!-- Display submission timestamp -->
            <p><span class="label">Submitted:</span> ${new Date().toLocaleString()}</p>
          </div>

          <!-- Message content section -->
          <h3>💬 Message:</h3>
          <!-- Message content box with preserved formatting -->
          <div class="message-box">
            <!-- Display message with preserved line breaks and whitespace -->
            <p style="white-space: pre-wrap;">${formData.message}</p>
          </div>

          ${formData.type === 'investment' ? `
          <div class="message-box urgent">
            <h4>🚨 Investment Inquiry - High Priority</h4>
            <p>This is a potential investment opportunity. Please respond promptly!</p>
          </div>
          ` : ''}

          ${formData.type === 'team' ? `
          <div class="message-box">
            <h4>👥 Team Application</h4>
            <p>Someone is interested in joining the team. Consider their background and skills!</p>
          </div>
          ` : ''}

          <h3>🎯 Recommended Actions:</h3>
          <ul>
            <li>✅ Respond within 24-48 hours</li>
            <li>📧 Reply directly to: ${formData.email}</li>
            <li>📊 Check admin panel for more details</li>
            ${formData.type === 'investment' ? '<li>🚨 Priority response required for investment inquiry</li>' : ''}
          </ul>
        </div>
        <!-- Email footer section -->
        <div class="footer">
          <!-- Footer links for website and admin panel -->
          <p>🌐 <a href="${siteUrl}">Visit Website</a> | 🛡️ <a href="${siteUrl}/admin">Admin Panel</a></p>
          <!-- Copyright notice -->
          <p>© 2025 Forklift Training & Assessment - Contact Form System</p>
        </div>
      </div>
    </body>
    </html>
  `
}

// Function to generate plain text email content for contact form submissions
function createContactEmailText(formData: ContactFormData): string {
  // Return the complete plain text email content
  return `
// Header for the plain text email
New Contact Form Submission - Forklift Training Platform

// Contact information section
Contact Details:
// Display contact form type
- Type: ${formData.type}
// Display sender's full name
- Name: ${formData.name}
// Display sender's email address
- Email: ${formData.email}
// Display message subject line
- Subject: ${formData.subject}
// Display submission timestamp
- Submitted: ${new Date().toLocaleString()}

// Message content section
Message:
// Display the actual message content
${formData.message}

// Response instruction
Please respond to: ${formData.email}

// Admin panel notification
This message has been stored in the admin panel for your review.
  `
}