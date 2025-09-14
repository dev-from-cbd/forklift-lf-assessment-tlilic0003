// Import the serve function from Deno's standard HTTP server module to handle HTTP requests
// Note: TypeScript may show errors for Deno imports, but they work correctly in Deno runtime
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
// Import createClient function from Supabase JavaScript client library for database operations
// Note: npm: prefix is Deno-specific syntax for importing npm packages
import { createClient } from 'npm:@supabase/supabase-js@2'

// Define CORS headers to allow cross-origin requests from any domain
const corsHeaders = {
  // Allow requests from any origin (wildcard)
  'Access-Control-Allow-Origin': '*',
  // Specify which headers are allowed in cross-origin requests
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Define TypeScript interface for email template structure
interface EmailTemplate {
  // Email subject line
  subject: string
  // HTML content of the email
  html: string
  // Plain text version of the email
  text: string
}

// Start the HTTP server with an async request handler function
serve(async (req) => {
  // Handle preflight OPTIONS requests for CORS
  if (req.method === 'OPTIONS') {
    // Return OK response with CORS headers for preflight requests
    return new Response('ok', { headers: corsHeaders })
  }

  // Wrap the main logic in try-catch block for error handling
  try {
    // Create Supabase admin client with service role key for database operations
    const supabaseAdmin = createClient(
      // Get Supabase URL from environment variables
      // Note: Deno is a global object in Deno runtime, TypeScript errors can be ignored
      Deno.env.get('SUPABASE_URL') ?? '',
      // Get Supabase service role key from environment variables
      // Note: Deno.env provides access to environment variables in Deno runtime
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        // Configure authentication settings
        auth: {
          // Disable automatic token refresh for server-side usage
          autoRefreshToken: false,
          // Disable session persistence for server-side usage
          persistSession: false
        }
      }
    )

    // Parse the incoming webhook payload from the request body
    const payload = await req.json()
    // Log the webhook payload for debugging purposes
    console.log('Email notification webhook payload:', payload)

    // Define the site URL for email links
    const siteUrl = 'https://forklift-lo-tlilic0004.netlify.app'
    // Define the admin email address for notifications
    const adminEmail = 'neoguru@gmail.com'

    // Handle different email events based on webhook payload
    if (payload.type === 'INSERT' && payload.table === 'auth.users') {
      // New user registration - send confirmation email
      await handleUserRegistration(payload.record, supabaseAdmin, siteUrl, adminEmail)
    } else if (payload.type === 'UPDATE' && payload.table === 'auth.users' && payload.record.email_confirmed_at) {
      // Email confirmed - send welcome email
      await handleEmailConfirmation(payload.record, supabaseAdmin, siteUrl, adminEmail)
    }

    // Return successful response indicating email notifications were processed
    return new Response(
      // Convert success message to JSON string for the response body
      JSON.stringify({ success: true, message: 'Email notifications processed' }),
      {
        // Merge CORS headers with Content-Type header
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        // Set HTTP status code to 200 (OK)
        status: 200,
      },
    )

  } catch (error) {
    // Log any errors that occur during processing
    console.error('Error in email notifications function:', error)
    // Return error response with error details
    return new Response(
      // Convert error message to JSON string for the response body
      JSON.stringify({ error: error.message }),
      {
        // Merge CORS headers with Content-Type header for error response
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        // Set HTTP status code to 500 (Internal Server Error)
        status: 500,
      },
    )
  }
// End of the serve function
})

// Async function to handle new user registration events
async function handleUserRegistration(user: any, supabase: any, siteUrl: string, adminEmail: string) {
  // Extract user email from the user object
  const userEmail = user.email
  // Extract user ID from the user object
  const userId = user.id
  // Get confirmation token or use placeholder if not available
  const confirmationToken = user.confirmation_token || 'token-placeholder'
  
  // Construct confirmation URL with token and signup type
  const confirmationUrl = `${siteUrl}/auth/callback?token=${confirmationToken}&type=signup`
  // Construct unsubscribe URL with encoded email and user token
  const unsubscribeUrl = `${siteUrl}/unsubscribe?email=${encodeURIComponent(userEmail)}&token=${userId}`

  // Create confirmation email template with user data and URLs
  const emailTemplate = createConfirmationEmail(userEmail, confirmationUrl, unsubscribeUrl, siteUrl)

  // Store email for admin review in the database
  await storeEmailNotification(supabase, {
    // Type of notification (email confirmation)
    type: 'email_confirmation',
    // User ID for tracking
    user_id: userId,
    // User's email address
    user_email: userEmail,
    // Complete email template data
    email_data: emailTemplate,
    // Admin email for notifications
    admin_email: adminEmail
  })

  // Log successful preparation of confirmation email
  console.log('Confirmation email prepared for:', userEmail)
}

// Async function to handle email confirmation events
async function handleEmailConfirmation(user: any, supabase: any, siteUrl: string, adminEmail: string) {
  // Extract user email from the user object
  const userEmail = user.email
  // Extract user ID from the user object
  const userId = user.id
  // Construct unsubscribe URL with encoded email and user token
  const unsubscribeUrl = `${siteUrl}/unsubscribe?email=${encodeURIComponent(userEmail)}&token=${userId}`

  // Create welcome email template with user data and URLs
  const emailTemplate = createWelcomeEmail(userEmail, siteUrl, unsubscribeUrl)

  // Store email for admin review in the database
  await storeEmailNotification(supabase, {
    // Type of notification (welcome email)
    type: 'welcome_email',
    // User ID for tracking
    user_id: userId,
    // User's email address
    user_email: userEmail,
    // Complete email template data
    email_data: emailTemplate,
    // Admin email for notifications
    admin_email: adminEmail
  })

  // Log successful preparation of welcome email
  console.log('Welcome email prepared for:', userEmail)
}

// Function to create confirmation email template with HTML and text content
function createConfirmationEmail(userEmail: string, confirmationUrl: string, unsubscribeUrl: string, siteUrl: string): EmailTemplate {
  // Define the email subject line with emoji and course name
  const subject = '🚛 Подтвердите ваш email - Forklift Training TLILIC0004'
  
  // Create HTML email content with embedded CSS styling
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <!-- Set character encoding to UTF-8 for proper text display -->
      <meta charset="utf-8">
      <!-- Set the page title for email clients -->
      <title>Подтверждение email</title>
      <!-- Embedded CSS styles for email formatting -->
      <style>
        /* Base body styling with font family, line height, and colors */
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        /* Container styling with max width and centering */
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        /* Header styling with gradient background and white text */
        .header { background: linear-gradient(135deg, #1e40af, #3730a3); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        /* Content area styling with light background and padding */
        .content { background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; }
        /* Button styling with blue background and hover effects */
        .button { display: inline-block; background: #1e40af; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: bold; }
        /* Button hover state with darker blue */
        .button:hover { background: #1d4ed8; }
        /* Features section styling with white background */
        .features { background: white; padding: 20px; border-radius: 6px; margin: 20px 0; }
        /* Individual feature item styling with flex layout */
        .feature-item { display: flex; align-items: center; margin: 10px 0; }
        /* Footer styling with centered text and border */
        .footer { text-align: center; margin-top: 30px; padding: 20px; color: #666; font-size: 14px; border-top: 1px solid #e2e8f0; }
        /* Unsubscribe link styling with small font */
        .unsubscribe { font-size: 12px; color: #999; margin-top: 20px; }
      </style>
    </head>
    <!-- Email body content -->
    <body>
      <!-- Main container div for email content -->
      <div class="container">
        <!-- Header section with gradient background -->
        <div class="header">
          <!-- Main heading with forklift emoji and course name -->
          <h1>🚛 Добро пожаловать в Forklift Training!</h1>
          <!-- Course license description -->
          <p>TLILIC0004 Licence to Operate an Order Picking Forklift Truck (LO)</p>
        </div>
        <!-- Main content section -->
        <div class="content">
          <!-- Personalized greeting with user's email -->
          <h2>Привет, ${userEmail}!</h2>
          <!-- Registration thank you message and confirmation instructions -->
          <p>Спасибо за регистрацию в нашем курсе обучения операторов погрузчиков! Для завершения регистрации необходимо подтвердить ваш email адрес.</p>
          
          <!-- Centered confirmation button section -->
          <div style="text-align: center; margin: 30px 0;">
            <!-- Confirmation button with dynamic URL -->
            <a href="${confirmationUrl}" class="button">✅ Подтвердить Email</a>
          </div>

          <!-- Features section highlighting course benefits -->
          <div class="features">
            <!-- Features section heading with target emoji -->
            <h3>🎯 Что вас ждет после подтверждения:</h3>
            <!-- Feature item: Access to training questions -->
            <div class="feature-item">
              <!-- Green checkmark icon -->
              <span style="color: #10b981; margin-right: 10px;">✓</span>
              <!-- Feature description -->
              <span>Доступ ко всем 72 обучающим вопросам</span>
            </div>
            <!-- Feature item: Interactive exercises -->
            <div class="feature-item">
              <!-- Green checkmark icon -->
              <span style="color: #10b981; margin-right: 10px;">✓</span>
              <!-- Feature description -->
              <span>Интерактивные упражнения разной сложности</span>
            </div>
            <!-- Feature item: Progress tracking -->
            <div class="feature-item">
              <!-- Green checkmark icon -->
              <span style="color: #10b981; margin-right: 10px;">✓</span>
              <!-- Feature description -->
              <span>Отслеживание прогресса обучения</span>
            </div>
            <!-- Feature item: Certificate -->
            <div class="feature-item">
              <!-- Green checkmark icon -->
              <span style="color: #10b981; margin-right: 10px;">✓</span>
              <!-- Feature description -->
              <span>Сертификат TLILIC0004 по завершении</span>
            </div>
            <!-- Feature item: Mobile version -->
            <div class="feature-item">
              <!-- Green checkmark icon -->
              <span style="color: #10b981; margin-right: 10px;">✓</span>
              <!-- Feature description -->
              <span>Мобильная версия для обучения в любом месте</span>
            </div>
          </div>

          <!-- Important notice about link expiration -->
          <p><strong>Важно:</strong> Ссылка для подтверждения действительна в течение 24 часов.</p>
          
          <!-- Message for users who didn't register -->
          <p>Если вы не регистрировались на нашем сайте, просто проигнорируйте это письмо.</p>
        </div>
        <!-- Footer section with copyright and unsubscribe -->
        <div class="footer">
          <!-- Copyright notice -->
          <p>© 2025 Forklift Training & Assessment - TLILIC0004</p>
          <!-- Email recipient information -->
          <p>Это письмо отправлено на: ${userEmail}</p>
          <!-- Unsubscribe section -->
          <div class="unsubscribe">
            <!-- Unsubscribe link with dynamic URL -->
            <p>Не хотите получать уведомления? <a href="${unsubscribeUrl}">Отписаться</a></p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `

  // Plain text version of the confirmation email for clients that don't support HTML
  const text = `
// Email subject line in plain text
Подтверждение email - Forklift Training TLILIC0004

// Personalized greeting
Привет, ${userEmail}!

// Thank you message for registration
Спасибо за регистрацию в нашем курсе обучения операторов погрузчиков!

// Instructions with confirmation URL
Для завершения регистрации перейдите по ссылке:
${confirmationUrl}

// List of features available after confirmation
Что вас ждет после подтверждения:
✓ Доступ ко всем 72 обучающим вопросам
✓ Интерактивные упражнения разной сложности  
✓ Отслеживание прогресса обучения
✓ Сертификат TLILIC0004 по завершении
✓ Мобильная версия для обучения в любом месте

// Link expiration notice
Ссылка действительна в течение 24 часов.

// Message for users who didn't register
Если вы не регистрировались на нашем сайте, просто проигнорируйте это письмо.

// Copyright and unsubscribe information
© 2025 Forklift Training & Assessment
Отписаться: ${unsubscribeUrl}
  `

  // Return email template object with subject, HTML, and text versions
  return { subject, html, text }
}

// Function to create welcome email template after email confirmation
function createWelcomeEmail(userEmail: string, siteUrl: string, unsubscribeUrl: string): EmailTemplate {
  // Define the welcome email subject line with celebration emoji
  const subject = '🎉 Email подтвержден! Добро пожаловать в Forklift Training!'
  
  // Create HTML welcome email content with green theme styling
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <!-- Set character encoding to UTF-8 for proper text display -->
      <meta charset="utf-8">
      <!-- Set the page title for email clients -->
      <title>Добро пожаловать!</title>
      <!-- Embedded CSS styles for welcome email formatting -->
      <style>
        /* Base body styling with font family, line height, and colors */
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        /* Container styling with max width and centering */
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        /* Header styling with green gradient background for welcome theme */
        .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        /* Content area styling with light green background */
        .content { background: #f0fdf4; padding: 30px; border: 1px solid #bbf7d0; }
        /* Button styling with green background and hover effects */
        .button { display: inline-block; background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: bold; }
        /* Button hover state with darker green */
        .button:hover { background: #059669; }
        /* Features section styling with white background and shadow */
        .features { background: white; padding: 25px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        /* Grid layout for feature items in two columns */
        .feature-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
        /* Individual feature item styling with flex layout */
        .feature-item { display: flex; align-items: flex-start; margin: 10px 0; }
        /* Highlight box styling with blue background and left border */
        .highlight-box { background: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; }
        /* Footer styling with centered text and border */
        .footer { text-align: center; margin-top: 30px; padding: 20px; color: #666; font-size: 14px; border-top: 1px solid #e2e8f0; }
        /* Unsubscribe link styling with small font */
        .unsubscribe { font-size: 12px; color: #999; margin-top: 20px; }
        /* Emoji styling with larger font size and margin */
        .emoji { font-size: 1.2em; margin-right: 8px; }
      </style>
    </head>
    <!-- Welcome email body content -->
    <body>
      <!-- Main container div for welcome email content -->
      <div class="container">
        <!-- Header section with green gradient background -->
        <div class="header">
          <!-- Congratulations heading with celebration emoji -->
          <h1>🎉 Поздравляем! Email подтвержден!</h1>
          <!-- Course access confirmation message -->
          <p>Теперь у вас есть полный доступ к курсу TLILIC0004</p>
        </div>
        <!-- Main content section with light green background -->
        <div class="content">
          <!-- Personalized congratulations message -->
          <h2>Отлично, ${userEmail}!</h2>
          <!-- Email confirmation success message and platform access info -->
          <p>Ваш email успешно подтвержден! Теперь вы можете в полной мере воспользоваться всеми возможностями нашей обучающей платформы.</p>
          
          <!-- Centered start learning button section -->
          <div style="text-align: center; margin: 30px 0;">
            <!-- Start learning button with rocket emoji and site URL -->
            <a href="${siteUrl}" class="button">🚀 Начать обучение</a>
          </div>

          <!-- Features section with white background -->
          <div class="features">
            <!-- Features section heading with star emoji -->
            <h3>🌟 Что доступно на нашем сайте:</h3>
            
            <!-- Grid layout for feature items -->
            <div class="feature-grid">
              <!-- Feature item: 72 training questions -->
              <div class="feature-item">
                <!-- Books emoji for learning content -->
                <span class="emoji">📚</span>
                <div>
                  <!-- Feature title and description -->
                  <strong>72 обучающих вопроса</strong><br>
                  <small>Полный курс TLILIC0004</small>
                </div>
              </div>
              <!-- Feature item: 3 difficulty levels -->
              <div class="feature-item">
                <!-- Target emoji for difficulty levels -->
                <span class="emoji">🎯</span>
                <div>
                  <!-- Feature title and description -->
                  <strong>3 уровня сложности</strong><br>
                  <small>Easy, Medium, Hard</small>
                </div>
              </div>
              <!-- Feature item: Interactive exercises -->
              <div class="feature-item">
                <!-- Puzzle emoji for interactive content -->
                <span class="emoji">🧩</span>
                <div>
                  <!-- Feature title and description -->
                  <strong>Интерактивные упражнения</strong><br>
                  <small>Word Bank, Multiple Choice</small>
                </div>
              </div>
              <!-- Feature item: Progress tracking -->
              <div class="feature-item">
                <!-- Chart emoji for progress statistics -->
                <span class="emoji">📊</span>
                <div>
                  <!-- Feature title and description -->
                  <strong>Отслеживание прогресса</strong><br>
                  <small>Ваша статистика обучения</small>
                </div>
              </div>
              <!-- Feature item: Mobile version -->
              <div class="feature-item">
                <!-- Mobile phone emoji for mobile access -->
                <span class="emoji">📱</span>
                <div>
                  <!-- Feature title and description -->
                  <strong>Мобильная версия</strong><br>
                  <small>Учитесь где угодно</small>
                </div>
              </div>
              <!-- Feature item: Certification -->
              <div class="feature-item">
                <!-- Trophy emoji for certification -->
                <span class="emoji">🏆</span>
                <div>
                  <!-- Feature title and description -->
                  <strong>Сертификация</strong><br>
                  <small>Официальный сертификат</small>
                </div>
              </div>
            </div>

            <!-- Highlighted information box with blue background -->
            <div class="highlight-box">
              <!-- Course information heading with truck emoji -->
              <h4>🚛 О курсе TLILIC0004:</h4>
              <!-- Course description and license information -->
              <p><strong>Licence to Operate an Order Picking Forklift Truck (LO)</strong> - это официальная лицензия для работы с погрузчиками для комплектации заказов. Наш курс поможет вам получить все необходимые знания и навыки.</p>
            </div>

            <!-- Learning features section heading with graduation cap emoji -->
            <h4>🎓 Особенности обучения:</h4>
            <!-- Learning feature: Adaptive learning -->
            <div class="feature-item">
              <!-- Green checkmark for completed feature -->
              <span style="color: #10b981; margin-right: 10px;">✓</span>
              <!-- Feature description -->
              <span><strong>Адаптивное обучение</strong> - система подстраивается под ваш уровень</span>
            </div>
            <!-- Learning feature: Instant feedback -->
            <div class="feature-item">
              <!-- Green checkmark for completed feature -->
              <span style="color: #10b981; margin-right: 10px;">✓</span>
              <!-- Feature description -->
              <span><strong>Мгновенная обратная связь</strong> - узнавайте результаты сразу</span>
            </div>
            <!-- Learning feature: Offline mode -->
            <div class="feature-item">
              <!-- Green checkmark for completed feature -->
              <span style="color: #10b981; margin-right: 10px;">✓</span>
              <!-- Feature description -->
              <span><strong>Офлайн-режим</strong> - продолжайте обучение без интернета</span>
            </div>
            <!-- Learning feature: Personal profile -->
            <div class="feature-item">
              <!-- Green checkmark for completed feature -->
              <span style="color: #10b981; margin-right: 10px;">✓</span>
              <!-- Feature description -->
              <span><strong>Персональный профиль</strong> - отслеживайте свои достижения</span>
            </div>
          </div>

          <!-- Learning tip highlight box with light bulb emoji -->
          <div class="highlight-box">
            <!-- Tip heading with light bulb emoji -->
            <h4>💡 Совет для эффективного обучения:</h4>
            <!-- Learning recommendation text -->
            <p>Рекомендуем проходить по 10-15 вопросов в день. Это поможет лучше усвоить материал и не перегружать себя информацией.</p>
          </div>

          <!-- Good luck message and support offer -->
          <p>Удачи в обучении! Если у вас возникнут вопросы, не стесняйтесь обращаться к нам.</p>
          
          <!-- Team signature -->
          <p><strong>Команда Forklift Training</strong></p>
        </div>
        <!-- Email footer section -->
        <div class="footer">
          <!-- Copyright notice -->
          <p>© 2025 Forklift Training & Assessment - TLILIC0004</p>
          <!-- Email recipient information -->
          <p>Это письмо отправлено на: ${userEmail}</p>
          <!-- Website link with globe emoji -->
          <p>🌐 Сайт: <a href="${siteUrl}">${siteUrl}</a></p>
          <!-- Unsubscribe section -->
          <div class="unsubscribe">
            <!-- Unsubscribe link -->
            <p>Не хотите получать уведомления? <a href="${unsubscribeUrl}">Отписаться</a></p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `

  // Plain text version of the welcome email for email clients that don't support HTML
  const text = `
🎉 Поздравляем! Email подтвержден!

Отлично, ${userEmail}!

Ваш email успешно подтвержден! Теперь вы можете в полной мере воспользоваться всеми возможностями нашей обучающей платформы.

🌟 Что доступно на нашем сайте:

📚 72 обучающих вопроса - Полный курс TLILIC0004
🎯 3 уровня сложности - Easy, Medium, Hard  
🧩 Интерактивные упражнения - Word Bank, Multiple Choice
📊 Отслеживание прогресса - Ваша статистика обучения
📱 Мобильная версия - Учитесь где угодно
🏆 Сертификация - Официальный сертификат

🚛 О курсе TLILIC0004:
Licence to Operate an Order Picking Forklift Truck (LO) - это официальная лицензия для работы с погрузчиками для комплектации заказов.

🎓 Особенности обучения:
✓ Адаптивное обучение - система подстраивается под ваш уровень
✓ Мгновенная обратная связь - узнавайте результаты сразу  
✓ Офлайн-режим - продолжайте обучение без интернета
✓ Персональный профиль - отслеживайте свои достижения

💡 Совет: Рекомендуем проходить по 10-15 вопросов в день для лучшего усвоения материала.

Начать обучение: ${siteUrl}

Удачи в обучении!
Команда Forklift Training

© 2025 Forklift Training & Assessment
Отписаться: ${unsubscribeUrl}
  `

  // Return email template object with subject, HTML and text versions
  return { subject, html, text }
}

// Function to store email notification data in the database
async function storeEmailNotification(supabase: any, data: any) {
  // Try to insert notification data into database
  try {
    // Insert notification record into admin_notifications table
    const { error } = await supabase
      .from('admin_notifications')
      .insert({
        // Notification type (e.g., 'user_registration', 'email_confirmation')
        type: data.type,
        // User ID from the webhook payload
        user_id: data.user_id,
        // User email address
        user_email: data.user_email,
        // Email template data object
        notification_data: {
          // Email subject line from template
          email_subject: data.email_data.subject,
          // HTML content of the email template
          email_html: data.email_data.html,
          // Plain text version of the email
          email_text: data.email_data.text,
          // Admin email address for notifications
          admin_email: data.admin_email,
          // Timestamp when email was sent
          sent_at: new Date().toISOString()
        },
        // Record creation timestamp
        created_at: new Date().toISOString()
      })

    // Check if database insertion failed
    if (error) {
      // Log database error details
      console.error('Error storing email notification:', error)
    } else {
      // Log successful notification storage
      console.log('Email notification stored successfully')
    }
  } catch (err) {
    // Log any unexpected errors during storage process
    console.error('Error in storeEmailNotification:', err)
  }
}