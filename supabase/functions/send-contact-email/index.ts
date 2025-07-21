import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
  type: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const formData: ContactFormData = await req.json()
    console.log('Received contact form submission:', formData)

    const adminEmail = 'neoguru@gmail.com'
    const siteUrl = 'https://forklift-lo-tlilic0004.netlify.app'

    // Create email content
    const emailHtml = createContactEmailHtml(formData, siteUrl)
    const emailText = createContactEmailText(formData)

    // Store the contact message in admin notifications
    const { error: notificationError } = await supabaseAdmin
      .from('admin_notifications')
      .insert({
        type: 'contact_form_submission',
        user_id: null,
        user_email: formData.email,
        notification_data: {
          contact_form_data: formData,
          email_html: emailHtml,
          email_text: emailText,
          admin_email: adminEmail,
          submitted_at: new Date().toISOString(),
          user_agent: req.headers.get('user-agent') || 'Unknown'
        },
        read: false,
        created_at: new Date().toISOString()
      })

    if (notificationError) {
      console.error('Error storing contact notification:', notificationError)
      throw new Error('Failed to store contact message')
    }

    console.log('Contact form submission stored successfully')

    // In a real implementation, you would integrate with an email service here
    // For now, we're storing in the database for admin review
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Contact form submitted successfully',
        stored_in_admin_panel: true
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error in contact form function:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Failed to submit contact form' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})

function createContactEmailHtml(formData: ContactFormData, siteUrl: string): string {
  const typeLabels = {
    general: 'General Inquiry',
    investment: 'Investment Opportunity',
    partnership: 'Partnership',
    support: 'Technical Support',
    team: 'Join Our Team'
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Contact Form Submission</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #1e40af, #3730a3); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; }
        .message-box { background: white; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #1e40af; }
        .footer { text-align: center; margin-top: 30px; padding: 20px; color: #666; font-size: 14px; border-top: 1px solid #e2e8f0; }
        .label { font-weight: bold; color: #1e40af; }
        .urgent { background: #fef2f2; border-left-color: #ef4444; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚛 New Contact Form Submission</h1>
          <p>Forklift Training & Assessment Platform</p>
        </div>
        <div class="content">
          <h2>📧 Contact Details</h2>
          
          <div class="message-box ${formData.type === 'investment' ? 'urgent' : ''}">
            <p><span class="label">Type:</span> ${typeLabels[formData.type as keyof typeof typeLabels] || formData.type}</p>
            <p><span class="label">Name:</span> ${formData.name}</p>
            <p><span class="label">Email:</span> ${formData.email}</p>
            <p><span class="label">Subject:</span> ${formData.subject}</p>
            <p><span class="label">Submitted:</span> ${new Date().toLocaleString()}</p>
          </div>

          <h3>💬 Message:</h3>
          <div class="message-box">
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
        <div class="footer">
          <p>🌐 <a href="${siteUrl}">Visit Website</a> | 🛡️ <a href="${siteUrl}/admin">Admin Panel</a></p>
          <p>© 2025 Forklift Training & Assessment - Contact Form System</p>
        </div>
      </div>
    </body>
    </html>
  `
}

function createContactEmailText(formData: ContactFormData): string {
  return `
New Contact Form Submission - Forklift Training Platform

Contact Details:
- Type: ${formData.type}
- Name: ${formData.name}
- Email: ${formData.email}
- Subject: ${formData.subject}
- Submitted: ${new Date().toLocaleString()}

Message:
${formData.message}

Please respond to: ${formData.email}

This message has been stored in the admin panel for your review.
  `
}