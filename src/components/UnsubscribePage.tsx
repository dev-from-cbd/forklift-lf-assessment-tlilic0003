// Import React and hooks for state management and lifecycle
import React, { useState, useEffect } from 'react';
// Import React Router hooks for URL parameters and navigation
import { useSearchParams, useNavigate } from 'react-router-dom';
// Import Supabase client for database operations
import { supabase } from '../config/supabase';
// Import icons from Lucide React for UI elements
import { CheckCircle, AlertCircle, Mail, ArrowLeft } from 'lucide-react';

// Define the UnsubscribePage functional component
const UnsubscribePage: React.FC = () => {
  // Hook to access URL search parameters
  const [searchParams] = useSearchParams();
  // Hook for programmatic navigation
  const navigate = useNavigate();
  // State to track the unsubscribe process status
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'already_unsubscribed'>('loading');
  // State to store the user's email address
  const [email, setEmail] = useState('');
  // State to store status messages for the user
  const [message, setMessage] = useState('');

  // Effect hook to handle unsubscribe process on component mount
  useEffect(() => {
    // Async function to handle the unsubscribe logic
    const handleUnsubscribe = async () => {
      // Extract email parameter from URL
      const emailParam = searchParams.get('email');
      // Extract token parameter from URL
      const token = searchParams.get('token');

      // Validate that both email and token are present
      if (!emailParam || !token) {
        // Set error status if parameters are missing
        setStatus('error');
        // Set error message for missing parameters
        setMessage('Неверная ссылка для отписки. Параметры email или token отсутствуют.');
        // Exit function early
        return;
      }

      // Store the email in state for display
      setEmail(emailParam);

      // Start try-catch block for database operations
      try {
        // Query Supabase to check if user preferences exist
        const { data: userData, error: userError } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('user_id', token)
          .single();

        // Handle case where user doesn't exist or other errors (except 'not found')
        if (userError && userError.code !== 'PGRST116') {
          // Create new user preferences record
          const { error: insertError } = await supabase
            .from('user_preferences')
            .insert({
              // Set user ID from token
              user_id: token,
              // Set email from URL parameter
              email: emailParam,
              // Disable email notifications
              email_notifications: false,
              // Record unsubscribe timestamp
              unsubscribed_at: new Date().toISOString()
            });

          // Handle potential insert errors gracefully
          if (insertError) {
            // Log that table might not exist but continue
            console.log('User preferences table may not exist, but unsubscribe request noted');
          }
        // Handle case where user data exists
        } else if (userData) {
          // Check if user is already unsubscribed
          if (userData.email_notifications === false) {
            // Set status to already unsubscribed
            setStatus('already_unsubscribed');
            // Set message for already unsubscribed user
            setMessage('Вы уже отписаны от рассылки.');
            // Exit function early
            return;
          }

          // Update existing user preferences to unsubscribe
          const { error: updateError } = await supabase
            .from('user_preferences')
            .update({
              // Disable email notifications
              email_notifications: false,
              // Record unsubscribe timestamp
              unsubscribed_at: new Date().toISOString()
            })
            // Match record by user ID
            .eq('user_id', token);

          // Log any update errors
          if (updateError) {
            console.error('Error updating preferences:', updateError);
          }
        }

        // Create admin notification record for unsubscribe event
        await supabase
          .from('admin_notifications')
          .insert({
            // Set notification type
            type: 'user_unsubscribed',
            // Store user ID from token
            user_id: token,
            // Store user email
            user_email: emailParam,
            // Additional notification data
            notification_data: {
              // Timestamp of unsubscribe
              unsubscribed_at: new Date().toISOString(),
              // User's browser information
              user_agent: navigator.userAgent,
              // IP address placeholder
              ip_address: 'unknown'
            }
          });

        // Set success status
        setStatus('success');
        // Set success message
        setMessage('Вы успешно отписаны от всех email-уведомлений.');

      // Catch and handle any errors during the process
      } catch (error) {
        // Log error to console
        console.error('Unsubscribe error:', error);
        // Set error status
        setStatus('error');
        // Set error message for user
        setMessage('Произошла ошибка при отписке. Попробуйте позже или свяжитесь с поддержкой.');
      }
    };

    // Execute the unsubscribe function
    handleUnsubscribe();
  // Dependency array - re-run when searchParams change
  }, [searchParams]);

  // Return JSX for the component
  return (
    // Main container with full height and centered content
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Centered container with max width */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* White card container with shadow */}
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Content container with centered text and spacing */}
          <div className="text-center space-y-6">
            {/* Loading state display */}
            {status === 'loading' && (
              <>
                {/* Animated loading spinner */}
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                {/* Loading title */}
                <h2 className="text-2xl font-bold text-gray-900">
                  Обработка запроса...
                </h2>
                {/* Loading description */}
                <p className="text-gray-600">
                  Пожалуйста, подождите, мы обрабатываем ваш запрос на отписку.
                </p>
              </>
            )}

            {/* Success state display */}
            {status === 'success' && (
              <>
                {/* Success icon container */}
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                  {/* Check circle icon */}
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                {/* Success title */}
                <h2 className="text-2xl font-bold text-gray-900">
                  Отписка выполнена
                </h2>
                {/* Success message and email display */}
                <div className="text-gray-600 space-y-2">
                  {/* Success message */}
                  <p>{message}</p>
                  {/* Email confirmation */}
                  <p className="text-sm">
                    Email: <span className="font-medium">{email}</span>
                  </p>
                </div>
                {/* Information box about what unsubscribe means */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  {/* Information box title */}
                  <h3 className="text-sm font-medium text-blue-900 mb-2">Что это означает:</h3>
                  {/* Information list */}
                  <ul className="text-sm text-blue-800 space-y-1">
                    {/* No more email notifications */}
                    <li>• Вы больше не будете получать email-уведомления от нас</li>
                    {/* Account remains active */}
                    <li>• Ваш аккаунт остается активным</li>
                    {/* Can continue using site */}
                    <li>• Вы можете продолжать пользоваться сайтом</li>
                    {/* Settings can be changed in profile */}
                    <li>• Настройки можно изменить в профиле</li>
                  </ul>
                </div>
              </>
            )}

            {/* Already unsubscribed state display */}
            {status === 'already_unsubscribed' && (
              <>
                {/* Warning icon container */}
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
                  {/* Mail icon */}
                  <Mail className="h-6 w-6 text-yellow-600" />
                </div>
                {/* Already unsubscribed title */}
                <h2 className="text-2xl font-bold text-gray-900">
                  Уже отписаны
                </h2>
                {/* Already unsubscribed message and email */}
                <div className="text-gray-600 space-y-2">
                  {/* Already unsubscribed message */}
                  <p>{message}</p>
                  {/* Email confirmation */}
                  <p className="text-sm">
                    Email: <span className="font-medium">{email}</span>
                  </p>
                </div>
              </>
            )}

            {/* Error state display */}
            {status === 'error' && (
              <>
                {/* Error icon container */}
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  {/* Alert circle icon */}
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                {/* Error title */}
                <h2 className="text-2xl font-bold text-gray-900">
                  Ошибка отписки
                </h2>
                {/* Error message and email display */}
                <div className="text-gray-600 space-y-2">
                  {/* Error message */}
                  <p>{message}</p>
                  {/* Conditional email display */}
                  {email && (
                    <p className="text-sm">
                      Email: <span className="font-medium">{email}</span>
                    </p>
                  )}
                </div>
                {/* Error help information box */}
                <div className="bg-red-50 p-4 rounded-lg">
                  {/* Help box title */}
                  <h3 className="text-sm font-medium text-red-900 mb-2">Что делать:</h3>
                  {/* Help instructions list */}
                  <ul className="text-sm text-red-800 space-y-1">
                    {/* Check link validity */}
                    <li>• Проверьте правильность ссылки</li>
                    {/* Try again later */}
                    <li>• Попробуйте позже</li>
                    {/* Contact support */}
                    <li>• Свяжитесь с поддержкой</li>
                    {/* Change settings in profile */}
                    <li>• Измените настройки в профиле</li>
                  </ul>
                </div>
              </>
            )}

            {/* Navigation buttons container */}
            <div className="space-y-3">
              {/* Return to home button */}
              <button
                onClick={() => navigate('/')}
                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {/* Arrow left icon */}
                <ArrowLeft className="w-4 h-4 mr-2" />
                Вернуться на главную
              </button>
              
              {/* Profile settings button - only shown on success */}
              {status === 'success' && (
                <button
                  onClick={() => navigate('/profile')}
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Настройки профиля
                </button>
              )}
            </div>
            {/* End of content container */}
          </div>
          {/* End of white card container */}
        </div>
        {/* End of centered container */}
      </div>
      {/* End of main container */}
    </div>
  );
}; // End of UnsubscribePage component

// Export the component as default
export default UnsubscribePage;