import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailTemplate {
  subject: string
  html: string
  text: string
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

    const payload = await req.json()
    console.log('Email notification webhook payload:', payload)

    const siteUrl = 'https://forklift-lo-tlilic0004.netlify.app'
    const adminEmail = 'neoguru@gmail.com'

    // Handle different email events
    if (payload.type === 'INSERT' && payload.table === 'auth.users') {
      // New user registration - send confirmation email
      await handleUserRegistration(payload.record, supabaseAdmin, siteUrl, adminEmail)
    } else if (payload.type === 'UPDATE' && payload.table === 'auth.users' && payload.record.email_confirmed_at) {
      // Email confirmed - send welcome email
      await handleEmailConfirmation(payload.record, supabaseAdmin, siteUrl, adminEmail)
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Email notifications processed' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error in email notifications function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})

async function handleUserRegistration(user: any, supabase: any, siteUrl: string, adminEmail: string) {
  const userEmail = user.email
  const userId = user.id
  const confirmationToken = user.confirmation_token || 'token-placeholder'
  
  const confirmationUrl = `${siteUrl}/auth/callback?token=${confirmationToken}&type=signup`
  const unsubscribeUrl = `${siteUrl}/unsubscribe?email=${encodeURIComponent(userEmail)}&token=${userId}`

  const emailTemplate = createConfirmationEmail(userEmail, confirmationUrl, unsubscribeUrl, siteUrl)

  // Store email for admin review
  await storeEmailNotification(supabase, {
    type: 'email_confirmation',
    user_id: userId,
    user_email: userEmail,
    email_data: emailTemplate,
    admin_email: adminEmail
  })

  console.log('Confirmation email prepared for:', userEmail)
}

async function handleEmailConfirmation(user: any, supabase: any, siteUrl: string, adminEmail: string) {
  const userEmail = user.email
  const userId = user.id
  const unsubscribeUrl = `${siteUrl}/unsubscribe?email=${encodeURIComponent(userEmail)}&token=${userId}`

  const emailTemplate = createWelcomeEmail(userEmail, siteUrl, unsubscribeUrl)

  // Store email for admin review
  await storeEmailNotification(supabase, {
    type: 'welcome_email',
    user_id: userId,
    user_email: userEmail,
    email_data: emailTemplate,
    admin_email: adminEmail
  })

  console.log('Welcome email prepared for:', userEmail)
}

function createConfirmationEmail(userEmail: string, confirmationUrl: string, unsubscribeUrl: string, siteUrl: string): EmailTemplate {
  const subject = '🚛 Подтвердите ваш email - Forklift Training TLILIC0004'
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Подтверждение email</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #1e40af, #3730a3); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; }
        .button { display: inline-block; background: #1e40af; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: bold; }
        .button:hover { background: #1d4ed8; }
        .features { background: white; padding: 20px; border-radius: 6px; margin: 20px 0; }
        .feature-item { display: flex; align-items: center; margin: 10px 0; }
        .footer { text-align: center; margin-top: 30px; padding: 20px; color: #666; font-size: 14px; border-top: 1px solid #e2e8f0; }
        .unsubscribe { font-size: 12px; color: #999; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚛 Добро пожаловать в Forklift Training!</h1>
          <p>TLILIC0004 Licence to Operate an Order Picking Forklift Truck (LO)</p>
        </div>
        <div class="content">
          <h2>Привет, ${userEmail}!</h2>
          <p>Спасибо за регистрацию в нашем курсе обучения операторов погрузчиков! Для завершения регистрации необходимо подтвердить ваш email адрес.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${confirmationUrl}" class="button">✅ Подтвердить Email</a>
          </div>

          <div class="features">
            <h3>🎯 Что вас ждет после подтверждения:</h3>
            <div class="feature-item">
              <span style="color: #10b981; margin-right: 10px;">✓</span>
              <span>Доступ ко всем 72 обучающим вопросам</span>
            </div>
            <div class="feature-item">
              <span style="color: #10b981; margin-right: 10px;">✓</span>
              <span>Интерактивные упражнения разной сложности</span>
            </div>
            <div class="feature-item">
              <span style="color: #10b981; margin-right: 10px;">✓</span>
              <span>Отслеживание прогресса обучения</span>
            </div>
            <div class="feature-item">
              <span style="color: #10b981; margin-right: 10px;">✓</span>
              <span>Сертификат TLILIC0004 по завершении</span>
            </div>
            <div class="feature-item">
              <span style="color: #10b981; margin-right: 10px;">✓</span>
              <span>Мобильная версия для обучения в любом месте</span>
            </div>
          </div>

          <p><strong>Важно:</strong> Ссылка для подтверждения действительна в течение 24 часов.</p>
          
          <p>Если вы не регистрировались на нашем сайте, просто проигнорируйте это письмо.</p>
        </div>
        <div class="footer">
          <p>© 2025 Forklift Training & Assessment - TLILIC0004</p>
          <p>Это письмо отправлено на: ${userEmail}</p>
          <div class="unsubscribe">
            <p>Не хотите получать уведомления? <a href="${unsubscribeUrl}">Отписаться</a></p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `

  const text = `
Подтверждение email - Forklift Training TLILIC0004

Привет, ${userEmail}!

Спасибо за регистрацию в нашем курсе обучения операторов погрузчиков!

Для завершения регистрации перейдите по ссылке:
${confirmationUrl}

Что вас ждет после подтверждения:
✓ Доступ ко всем 72 обучающим вопросам
✓ Интерактивные упражнения разной сложности  
✓ Отслеживание прогресса обучения
✓ Сертификат TLILIC0004 по завершении
✓ Мобильная версия для обучения в любом месте

Ссылка действительна в течение 24 часов.

Если вы не регистрировались на нашем сайте, просто проигнорируйте это письмо.

© 2025 Forklift Training & Assessment
Отписаться: ${unsubscribeUrl}
  `

  return { subject, html, text }
}

function createWelcomeEmail(userEmail: string, siteUrl: string, unsubscribeUrl: string): EmailTemplate {
  const subject = '🎉 Email подтвержден! Добро пожаловать в Forklift Training!'
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Добро пожаловать!</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f0fdf4; padding: 30px; border: 1px solid #bbf7d0; }
        .button { display: inline-block; background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: bold; }
        .button:hover { background: #059669; }
        .features { background: white; padding: 25px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .feature-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
        .feature-item { display: flex; align-items: flex-start; margin: 10px 0; }
        .highlight-box { background: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; padding: 20px; color: #666; font-size: 14px; border-top: 1px solid #e2e8f0; }
        .unsubscribe { font-size: 12px; color: #999; margin-top: 20px; }
        .emoji { font-size: 1.2em; margin-right: 8px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Поздравляем! Email подтвержден!</h1>
          <p>Теперь у вас есть полный доступ к курсу TLILIC0004</p>
        </div>
        <div class="content">
          <h2>Отлично, ${userEmail}!</h2>
          <p>Ваш email успешно подтвержден! Теперь вы можете в полной мере воспользоваться всеми возможностями нашей обучающей платформы.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${siteUrl}" class="button">🚀 Начать обучение</a>
          </div>

          <div class="features">
            <h3>🌟 Что доступно на нашем сайте:</h3>
            
            <div class="feature-grid">
              <div class="feature-item">
                <span class="emoji">📚</span>
                <div>
                  <strong>72 обучающих вопроса</strong><br>
                  <small>Полный курс TLILIC0004</small>
                </div>
              </div>
              <div class="feature-item">
                <span class="emoji">🎯</span>
                <div>
                  <strong>3 уровня сложности</strong><br>
                  <small>Easy, Medium, Hard</small>
                </div>
              </div>
              <div class="feature-item">
                <span class="emoji">🧩</span>
                <div>
                  <strong>Интерактивные упражнения</strong><br>
                  <small>Word Bank, Multiple Choice</small>
                </div>
              </div>
              <div class="feature-item">
                <span class="emoji">📊</span>
                <div>
                  <strong>Отслеживание прогресса</strong><br>
                  <small>Ваша статистика обучения</small>
                </div>
              </div>
              <div class="feature-item">
                <span class="emoji">📱</span>
                <div>
                  <strong>Мобильная версия</strong><br>
                  <small>Учитесь где угодно</small>
                </div>
              </div>
              <div class="feature-item">
                <span class="emoji">🏆</span>
                <div>
                  <strong>Сертификация</strong><br>
                  <small>Официальный сертификат</small>
                </div>
              </div>
            </div>

            <div class="highlight-box">
              <h4>🚛 О курсе TLILIC0004:</h4>
              <p><strong>Licence to Operate an Order Picking Forklift Truck (LO)</strong> - это официальная лицензия для работы с погрузчиками для комплектации заказов. Наш курс поможет вам получить все необходимые знания и навыки.</p>
            </div>

            <h4>🎓 Особенности обучения:</h4>
            <div class="feature-item">
              <span style="color: #10b981; margin-right: 10px;">✓</span>
              <span><strong>Адаптивное обучение</strong> - система подстраивается под ваш уровень</span>
            </div>
            <div class="feature-item">
              <span style="color: #10b981; margin-right: 10px;">✓</span>
              <span><strong>Мгновенная обратная связь</strong> - узнавайте результаты сразу</span>
            </div>
            <div class="feature-item">
              <span style="color: #10b981; margin-right: 10px;">✓</span>
              <span><strong>Офлайн-режим</strong> - продолжайте обучение без интернета</span>
            </div>
            <div class="feature-item">
              <span style="color: #10b981; margin-right: 10px;">✓</span>
              <span><strong>Персональный профиль</strong> - отслеживайте свои достижения</span>
            </div>
          </div>

          <div class="highlight-box">
            <h4>💡 Совет для эффективного обучения:</h4>
            <p>Рекомендуем проходить по 10-15 вопросов в день. Это поможет лучше усвоить материал и не перегружать себя информацией.</p>
          </div>

          <p>Удачи в обучении! Если у вас возникнут вопросы, не стесняйтесь обращаться к нам.</p>
          
          <p><strong>Команда Forklift Training</strong></p>
        </div>
        <div class="footer">
          <p>© 2025 Forklift Training & Assessment - TLILIC0004</p>
          <p>Это письмо отправлено на: ${userEmail}</p>
          <p>🌐 Сайт: <a href="${siteUrl}">${siteUrl}</a></p>
          <div class="unsubscribe">
            <p>Не хотите получать уведомления? <a href="${unsubscribeUrl}">Отписаться</a></p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `

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

  return { subject, html, text }
}

async function storeEmailNotification(supabase: any, data: any) {
  try {
    const { error } = await supabase
      .from('admin_notifications')
      .insert({
        type: data.type,
        user_id: data.user_id,
        user_email: data.user_email,
        notification_data: {
          email_subject: data.email_data.subject,
          email_html: data.email_data.html,
          email_text: data.email_data.text,
          admin_email: data.admin_email,
          sent_at: new Date().toISOString()
        },
        created_at: new Date().toISOString()
      })

    if (error) {
      console.error('Error storing email notification:', error)
    } else {
      console.log('Email notification stored successfully')
    }
  } catch (err) {
    console.error('Error in storeEmailNotification:', err)
  }
}