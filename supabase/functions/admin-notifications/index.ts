import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailData {
  to: string
  subject: string
  html: string
  text?: string
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

    // Get the webhook payload
    const payload = await req.json()
    console.log('Received webhook payload:', payload)

    // Check if this is a user signup event
    if (payload.type === 'INSERT' && payload.table === 'auth.users') {
      const newUser = payload.record
      const userEmail = newUser.email
      const userId = newUser.id

      console.log('New user registered:', userEmail)

      // Create email content that mimics the actual confirmation email
      const confirmationEmailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Welcome to Forklift Training</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1e40af, #3730a3); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚛 Welcome to Forklift Training!</h1>
              <p>TLILIC0004 Licence to Operate an Order Picking Forklift Truck (LO)</p>
            </div>
            <div class="content">
              <h2>Hello ${userEmail}!</h2>
              <p>Thank you for registering for our Forklift Training & Assessment course. Your account has been successfully created.</p>
              
              <p><strong>What's next?</strong></p>
              <ul>
                <li>✅ Complete your email verification (if required)</li>
                <li>📚 Access all 72 training questions</li>
                <li>🎯 Track your progress through the course</li>
                <li>🏆 Earn your TLILIC0004 certification</li>
              </ul>

              <p>You can start your training immediately by clicking the button below:</p>
              
              <a href="https://forklift-lo-tlilic0004.netlify.app/" class="button">Start Training Now</a>

              <p><strong>Course Features:</strong></p>
              <ul>
                <li>Multiple difficulty levels (Easy, Medium, Hard)</li>
                <li>Interactive exercises and word banks</li>
                <li>Progress tracking and completion certificates</li>
                <li>Mobile-friendly design for learning on the go</li>
              </ul>

              <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
              
              <p>Good luck with your training!</p>
              
              <p><strong>The Forklift Training Team</strong></p>
            </div>
            <div class="footer">
              <p>© 2025 Forklift Training & Assessment - TLILIC0004</p>
              <p>This email was sent to: ${userEmail}</p>
              <p>User ID: ${userId}</p>
              <p>Registration Time: ${new Date().toLocaleString()}</p>
            </div>
          </div>
        </body>
        </html>
      `

      const confirmationEmailText = `
Welcome to Forklift Training!

Hello ${userEmail}!

Thank you for registering for our TLILIC0004 Licence to Operate an Order Picking Forklift Truck (LO) training course.

Your account has been successfully created and you can start training immediately.

Course Features:
- 72 comprehensive training questions
- Multiple difficulty levels
- Progress tracking
- Mobile-friendly design

Start your training: https://forklift-lo-tlilic0004.netlify.app/

If you need assistance, please contact our support team.

Good luck with your training!

The Forklift Training Team
© 2025 Forklift Training & Assessment
      `

      // Send notification to admin
      const adminNotificationHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>New User Registration - Admin Notification</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .admin-header { background: linear-gradient(135deg, #7c3aed, #5b21b6); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .admin-content { background: #faf5ff; padding: 20px; border: 2px solid #7c3aed; }
            .user-email { background: #ede9fe; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #7c3aed; }
            .original-email { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="admin-header">
              <h1>🔔 New User Registration Alert</h1>
              <p>Admin Notification - Forklift Training System</p>
            </div>
            <div class="admin-content">
              <h2>📧 New User Registered</h2>
              
              <div class="user-email">
                <h3>User Details:</h3>
                <p><strong>Email:</strong> ${userEmail}</p>
                <p><strong>User ID:</strong> ${userId}</p>
                <p><strong>Registration Time:</strong> ${new Date().toLocaleString()}</p>
                <p><strong>Registration Source:</strong> Forklift Training Website</p>
              </div>

              <h3>📋 Actions Required:</h3>
              <ul>
                <li>✅ User account created successfully</li>
                <li>📧 Welcome email sent to user</li>
                <li>👤 User can now access the training course</li>
                <li>📊 Monitor user progress in admin panel</li>
              </ul>

              <p><strong>Admin Panel:</strong> <a href="https://forklift-lo-tlilic0004.netlify.app/admin">View Admin Dashboard</a></p>

              <hr style="margin: 30px 0; border: 1px solid #e2e8f0;">

              <h3>📨 Copy of Welcome Email Sent to User:</h3>
              <div class="original-email">
                ${confirmationEmailHtml}
              </div>
            </div>
            <div class="footer">
              <p>🛡️ This is an automated admin notification</p>
              <p>© 2025 Forklift Training & Assessment - Admin System</p>
            </div>
          </div>
        </body>
        </html>
      `

      // Here you would integrate with your email service
      // For now, we'll log the email content and store it in the database
      
      // Store notification in database for admin review
      const { error: notificationError } = await supabaseAdmin
        .from('admin_notifications')
        .insert({
          type: 'new_user_registration',
          user_id: userId,
          user_email: userEmail,
          notification_data: {
            welcome_email_html: confirmationEmailHtml,
            welcome_email_text: confirmationEmailText,
            admin_notification_html: adminNotificationHtml,
            registration_time: new Date().toISOString()
          },
          created_at: new Date().toISOString()
        })

      if (notificationError) {
        console.error('Error storing admin notification:', notificationError)
      }

      console.log('Admin notification created for new user:', userEmail)

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Admin notification sent',
          user_email: userEmail,
          user_id: userId
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      )
    }

    return new Response(
      JSON.stringify({ message: 'Event processed' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error in admin notifications function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})