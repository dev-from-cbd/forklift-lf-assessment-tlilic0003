import React, { useEffect, useState } from 'react';
import { supabase } from '../config/supabase';
import { 
  Bell, 
  Mail, 
  User, 
  Clock, 
  Eye, 
  EyeOff, 
  Loader2,
  AlertCircle,
  CheckCircle,
  RefreshCw
} from 'lucide-react';

interface AdminNotification {
  id: string;
  type: string;
  user_id: string;
  user_email: string;
  notification_data: {
    email_subject?: string;
    email_html?: string;
    email_text?: string;
    admin_email?: string;
    sent_at?: string;
    welcome_email_html?: string;
    welcome_email_text?: string;
    admin_notification_html?: string;
    registration_time?: string;
    unsubscribed_at?: string;
    user_agent?: string;
  };
  read: boolean;
  created_at: string;
}

const AdminNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedNotification, setSelectedNotification] = useState<AdminNotification | null>(null);
  const [showEmailPreview, setShowEmailPreview] = useState(false);

  useEffect(() => {
    fetchNotifications();
    
    // Set up real-time subscription for new notifications
    const subscription = supabase
      .channel('admin_notifications')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'admin_notifications' },
        (payload) => {
          console.log('New notification received:', payload);
          fetchNotifications(); // Refresh notifications
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError('');

      const { data, error: fetchError } = await supabase
        .from('admin_notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (fetchError) {
        throw fetchError;
      }

      setNotifications(data || []);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('admin_notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      ));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600 mr-2" />
        <span>Loading notifications...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Bell className="w-6 h-6 text-purple-600 mr-2" />
          <h2 className="text-2xl font-bold">Admin Notifications</h2>
          {unreadCount > 0 && (
            <span className="ml-3 px-2 py-1 bg-red-500 text-white text-sm rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>
        <button
          onClick={fetchNotifications}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No notifications yet</p>
            <p className="text-sm">You'll receive notifications when new users register</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-6 rounded-lg border-2 transition-colors ${
                notification.read 
                  ? 'bg-gray-50 border-gray-200' 
                  : 'bg-blue-50 border-blue-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <User className="w-5 h-5 text-blue-600 mr-2" />
                    <h3 className="text-lg font-semibold">
                      {notification.type === 'email_confirmation' ? 'Email Confirmation Sent' :
                       notification.type === 'welcome_email' ? 'Welcome Email Sent' :
                       notification.type === 'user_unsubscribed' ? 'User Unsubscribed' :
                       notification.type === 'contact_form_submission' ? 'Contact Form Submission' :
                       'New User Registration'}
                    </h3>
                    {!notification.read && (
                      <span className="ml-2 px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
                        NEW
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      <span className="font-medium">{notification.user_email}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>
                        {new Date(notification.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center space-x-4">
                    <button
                      onClick={() => {
                        setSelectedNotification(notification);
                        setShowEmailPreview(true);
                      }}
                      className="flex items-center px-3 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      {notification.type === 'user_unsubscribed' ? 'View Details' : 
                       notification.type === 'contact_form_submission' ? 'View Message' : 'View Email'}
                    </button>
                    
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="flex items-center px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Mark as Read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Email Preview Modal */}
      {showEmailPreview && selectedNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-bold">
                {selectedNotification.type === 'user_unsubscribed' ? 'Unsubscribe Details' : 
                 selectedNotification.type === 'contact_form_submission' ? 'Contact Form Message' : 'Email Preview'} - {selectedNotification.user_email}
              </h3>
              <button
                onClick={() => setShowEmailPreview(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <EyeOff className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              {selectedNotification.type === 'user_unsubscribed' ? (
                <div className="space-y-4">
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-red-900 mb-2">User Unsubscribed</h4>
                    <p className="text-red-800">
                      User {selectedNotification.user_email} has unsubscribed from email notifications.
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Details:</h4>
                    <ul className="space-y-1 text-sm">
                      <li><strong>Email:</strong> {selectedNotification.user_email}</li>
                      <li><strong>Unsubscribed at:</strong> {selectedNotification.notification_data.unsubscribed_at ? new Date(selectedNotification.notification_data.unsubscribed_at).toLocaleString() : 'Unknown'}</li>
                      <li><strong>User Agent:</strong> {selectedNotification.notification_data.user_agent || 'Unknown'}</li>
                    </ul>
                  </div>
                </div>
              ) : selectedNotification.type === 'contact_form_submission' ? (
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Contact Form Submission</h4>
                    <p className="text-blue-800">
                      New message received from {selectedNotification.user_email}
                    </p>
                  </div>
                  
                  {selectedNotification.notification_data.contact_form_data && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Message Details:</h4>
                      <div className="space-y-2 text-sm">
                        <p><strong>Type:</strong> {selectedNotification.notification_data.contact_form_data.type}</p>
                        <p><strong>Name:</strong> {selectedNotification.notification_data.contact_form_data.name}</p>
                        <p><strong>Email:</strong> {selectedNotification.notification_data.contact_form_data.email}</p>
                        <p><strong>Subject:</strong> {selectedNotification.notification_data.contact_form_data.subject}</p>
                        <p><strong>Submitted:</strong> {selectedNotification.notification_data.submitted_at ? new Date(selectedNotification.notification_data.submitted_at).toLocaleString() : 'Unknown'}</p>
                      </div>
                    </div>
                  )}
                  
                  {selectedNotification.notification_data.contact_form_data?.message && (
                    <div className="bg-white p-4 rounded-lg border">
                      <h4 className="font-semibold mb-2">Message:</h4>
                      <div className="whitespace-pre-wrap text-gray-800">
                        {selectedNotification.notification_data.contact_form_data.message}
                      </div>
                    </div>
                  )}
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2">Action Required:</h4>
                    <p className="text-green-800">
                      Please respond to this inquiry by replying directly to: 
                      <a href={`mailto:${selectedNotification.user_email}`} className="font-semibold underline ml-1">
                        {selectedNotification.user_email}
                      </a>
                    </p>
                  </div>
                </div>
              ) : (
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: selectedNotification.notification_data.email_html || 
                           selectedNotification.notification_data.welcome_email_html || 
                           '<p>No email content available</p>'
                  }}
                />
              )}
            </div>
            
            <div className="p-6 border-t bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  <p><strong>Sent to:</strong> {selectedNotification.user_email}</p>
                  <p><strong>Time:</strong> {new Date(selectedNotification.notification_data.sent_at || selectedNotification.notification_data.registration_time || selectedNotification.created_at).toLocaleString()}</p>
                  {selectedNotification.notification_data.email_subject && (
                    <p><strong>Subject:</strong> {selectedNotification.notification_data.email_subject}</p>
                  )}
                </div>
                <button
                  onClick={() => setShowEmailPreview(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNotifications;