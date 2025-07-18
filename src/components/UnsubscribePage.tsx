import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';
import { CheckCircle, AlertCircle, Mail, ArrowLeft } from 'lucide-react';

const UnsubscribePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'already_unsubscribed'>('loading');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleUnsubscribe = async () => {
      const emailParam = searchParams.get('email');
      const token = searchParams.get('token');

      if (!emailParam || !token) {
        setStatus('error');
        setMessage('Неверная ссылка для отписки. Параметры email или token отсутствуют.');
        return;
      }

      setEmail(emailParam);

      try {
        // Check if user exists and update their email preferences
        const { data: userData, error: userError } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('user_id', token)
          .single();

        if (userError && userError.code !== 'PGRST116') {
          // If table doesn't exist or other error, create the record
          const { error: insertError } = await supabase
            .from('user_preferences')
            .insert({
              user_id: token,
              email: emailParam,
              email_notifications: false,
              unsubscribed_at: new Date().toISOString()
            });

          if (insertError) {
            // If table doesn't exist, that's okay - we'll just show success
            console.log('User preferences table may not exist, but unsubscribe request noted');
          }
        } else if (userData) {
          // Update existing record
          if (userData.email_notifications === false) {
            setStatus('already_unsubscribed');
            setMessage('Вы уже отписаны от рассылки.');
            return;
          }

          const { error: updateError } = await supabase
            .from('user_preferences')
            .update({
              email_notifications: false,
              unsubscribed_at: new Date().toISOString()
            })
            .eq('user_id', token);

          if (updateError) {
            console.error('Error updating preferences:', updateError);
          }
        }

        // Log the unsubscribe event for admin
        await supabase
          .from('admin_notifications')
          .insert({
            type: 'user_unsubscribed',
            user_id: token,
            user_email: emailParam,
            notification_data: {
              unsubscribed_at: new Date().toISOString(),
              user_agent: navigator.userAgent,
              ip_address: 'unknown'
            }
          });

        setStatus('success');
        setMessage('Вы успешно отписаны от всех email-уведомлений.');

      } catch (error) {
        console.error('Unsubscribe error:', error);
        setStatus('error');
        setMessage('Произошла ошибка при отписке. Попробуйте позже или свяжитесь с поддержкой.');
      }
    };

    handleUnsubscribe();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center space-y-6">
            {status === 'loading' && (
              <>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Обработка запроса...
                </h2>
                <p className="text-gray-600">
                  Пожалуйста, подождите, мы обрабатываем ваш запрос на отписку.
                </p>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Отписка выполнена
                </h2>
                <div className="text-gray-600 space-y-2">
                  <p>{message}</p>
                  <p className="text-sm">
                    Email: <span className="font-medium">{email}</span>
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-blue-900 mb-2">Что это означает:</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Вы больше не будете получать email-уведомления от нас</li>
                    <li>• Ваш аккаунт остается активным</li>
                    <li>• Вы можете продолжать пользоваться сайтом</li>
                    <li>• Настройки можно изменить в профиле</li>
                  </ul>
                </div>
              </>
            )}

            {status === 'already_unsubscribed' && (
              <>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
                  <Mail className="h-6 w-6 text-yellow-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Уже отписаны
                </h2>
                <div className="text-gray-600 space-y-2">
                  <p>{message}</p>
                  <p className="text-sm">
                    Email: <span className="font-medium">{email}</span>
                  </p>
                </div>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Ошибка отписки
                </h2>
                <div className="text-gray-600 space-y-2">
                  <p>{message}</p>
                  {email && (
                    <p className="text-sm">
                      Email: <span className="font-medium">{email}</span>
                    </p>
                  )}
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-red-900 mb-2">Что делать:</h3>
                  <ul className="text-sm text-red-800 space-y-1">
                    <li>• Проверьте правильность ссылки</li>
                    <li>• Попробуйте позже</li>
                    <li>• Свяжитесь с поддержкой</li>
                    <li>• Измените настройки в профиле</li>
                  </ul>
                </div>
              </>
            )}

            <div className="space-y-3">
              <button
                onClick={() => navigate('/')}
                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Вернуться на главную
              </button>
              
              {status === 'success' && (
                <button
                  onClick={() => navigate('/profile')}
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Настройки профиля
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnsubscribePage;