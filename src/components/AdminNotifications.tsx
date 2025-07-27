// Import React library and hooks for state management and side effects
import React, { useEffect, useState } from 'react';
// Import Supabase client configuration for database operations
import { supabase } from '../config/supabase';
// Import various icons from the lucide-react icon library
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

// Define TypeScript interface for AdminNotification object structure
interface AdminNotification {
  // Unique identifier for the notification
  id: string;
  // Type of notification (email_confirmation, welcome_email, etc.)
  type: string;
  // User ID associated with the notification
  user_id: string;
  // Email address of the user
  user_email: string;
  // Object containing notification-specific data
  notification_data: {
    // Optional email subject line
    email_subject?: string;
    // Optional HTML content of the email
    email_html?: string;
    // Optional plain text content of the email
    email_text?: string;
    // Optional admin email address
    admin_email?: string;
    // Optional timestamp when email was sent
    sent_at?: string;
    // Optional HTML content for welcome email
    welcome_email_html?: string;
    // Optional plain text content for welcome email
    welcome_email_text?: string;
    // Optional HTML content for admin notification
    admin_notification_html?: string;
    // Optional registration timestamp
    registration_time?: string;
    // Optional unsubscribe timestamp
    unsubscribed_at?: string;
    // Optional user agent information
    user_agent?: string;
  };
  // Boolean indicating if notification has been read
  read: boolean;
  // Timestamp when notification was created
  created_at: string;
}

// Define the AdminNotifications functional component with TypeScript typing
const AdminNotifications: React.FC = () => {
  // State to store array of notifications
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  // State to track loading status
  const [loading, setLoading] = useState(true);
  // State to store error messages
  const [error, setError] = useState('');
  // State to store currently selected notification for preview
  const [selectedNotification, setSelectedNotification] = useState<AdminNotification | null>(null);
  // State to control email preview modal visibility
  const [showEmailPreview, setShowEmailPreview] = useState(false);

  // useEffect hook to run side effects when component mounts
  useEffect(() => {
    // Fetch notifications when component loads
    fetchNotifications();
    
    // Set up real-time subscription for new notifications
    // Create a Supabase channel for real-time updates
    const subscription = supabase
      .channel('admin_notifications')
      // Listen for INSERT events on the admin_notifications table
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'admin_notifications' },
        (payload) => {
          // Log new notification to console
          console.log('New notification received:', payload);
          // Refresh notifications list when new notification arrives
          fetchNotifications(); // Refresh notifications
        }
      )
      // Subscribe to the channel
      .subscribe();

    // Cleanup function to unsubscribe when component unmounts
    return () => {
      subscription.unsubscribe();
    };
  }, []); // Empty dependency array means this runs once on mount

  // Async function to fetch notifications from Supabase
  const fetchNotifications = async () => {
    try {
      // Set loading state to true
      setLoading(true);
      // Clear any existing errors
      setError('');

      // Query Supabase for admin notifications
      const { data, error: fetchError } = await supabase
        .from('admin_notifications') // From admin_notifications table
        .select('*') // Select all columns
        .order('created_at', { ascending: false }) // Order by creation date, newest first
        .limit(50); // Limit to 50 most recent notifications

      // If there's an error in the query, throw it
      if (fetchError) {
        throw fetchError;
      }

      // Update notifications state with fetched data or empty array
      setNotifications(data || []);
    } catch (err) {
      // Log error to console
      console.error('Error fetching notifications:', err);
      // Set error message for user display
      setError('Failed to load notifications');
    } finally {
      // Always set loading to false when done
      setLoading(false);
    }
  };

  // Async function to mark a notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      // Update the notification in Supabase to mark as read
      const { error } = await supabase
        .from('admin_notifications') // From admin_notifications table
        .update({ read: true }) // Set read field to true
        .eq('id', notificationId); // Where id matches the provided notificationId

      // If there's an error, throw it
      if (error) throw error;

      // Update local state to reflect the change
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      ));
    } catch (err) {
      // Log error to console
      console.error('Error marking notification as read:', err);
    }
  };

  // Calculate count of unread notifications
  const unreadCount = notifications.filter(n => !n.read).length;

  // If loading, show loading spinner
  if (loading) {
    return (
      // Loading container with centered content
      <div className="flex items-center justify-center p-8">
        // Spinning loader icon
        <Loader2 className="w-6 h-6 animate-spin text-blue-600 mr-2" />
        // Loading text
        <span>Loading notifications...</span>
      </div>
    );
  }

  // Main component render
  return (
    // Main container with vertical spacing
    <div className="space-y-6">
      // Header section comment
      {/* Header */}
      // Header with flex layout for title and refresh button
      <div className="flex items-center justify-between">
        // Left side with title and unread count
        <div className="flex items-center">
          // Bell icon
          <Bell className="w-6 h-6 text-purple-600 mr-2" />
          // Page title
          <h2 className="text-2xl font-bold">Admin Notifications</h2>
          // Show unread count badge if there are unread notifications
          {unreadCount > 0 && (
            <span className="ml-3 px-2 py-1 bg-red-500 text-white text-sm rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>
        // Refresh button
        <button
          onClick={fetchNotifications}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          // Refresh icon
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </button>
      </div>

      // Error message display if there's an error
      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center">
          // Alert circle icon
          <AlertCircle className="w-5 h-5 mr-2" />
          // Error message text
          {error}
        </div>
      )}

      // Notifications List section comment
      {/* Notifications List */}
      // Container for notifications list
      <div className="space-y-4">
        // Conditional rendering: show empty state or notifications list
        {notifications.length === 0 ? (
          // Empty state when no notifications
          <div className="text-center py-8 text-gray-500">
            // Large bell icon for empty state
            <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            // Empty state message
            <p>No notifications yet</p>
            // Additional empty state text
            <p className="text-sm">You'll receive notifications when new users register</p>
          </div>
        ) : (
          // Map through notifications to render each one
          notifications.map((notification) => (
            // Individual notification card
            <div
              key={notification.id}
              className={`p-6 rounded-lg border-2 transition-colors ${
                notification.read 
                  ? 'bg-gray-50 border-gray-200' 
                  : 'bg-blue-50 border-blue-200'
              }`}
            >
              // Notification content container
              <div className="flex items-start justify-between">
                // Main notification content
                <div className="flex-1">
                  // Notification header with icon and title
                  <div className="flex items-center mb-2">
                    // User icon
                    <User className="w-5 h-5 text-blue-600 mr-2" />
                    // Notification title based on type
                    <h3 className="text-lg font-semibold">
                      {notification.type === 'email_confirmation' ? 'Email Confirmation Sent' :
                       notification.type === 'welcome_email' ? 'Welcome Email Sent' :
                       notification.type === 'user_unsubscribed' ? 'User Unsubscribed' :
                       notification.type === 'contact_form_submission' ? 'Contact Form Submission' :
                       'New User Registration'}
                    </h3>
                    // Show "NEW" badge for unread notifications
                    {!notification.read && (
                      <span className="ml-2 px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
                        NEW
                      </span>
                    )}
                  </div>
                  
                  // Notification details section
                  <div className="space-y-2 text-sm text-gray-600">
                    // User email with mail icon
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      <span className="font-medium">{notification.user_email}</span>
                    </div>
                    // Timestamp with clock icon
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>
                        {new Date(notification.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  // Action buttons section
                  <div className="mt-4 flex items-center space-x-4">
                    // View details/email button
                    <button
                      onClick={() => {
                        setSelectedNotification(notification);
                        setShowEmailPreview(true);
                      }}
                      className="flex items-center px-3 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
                    >
                      // Eye icon
                      <Eye className="w-4 h-4 mr-1" />
                      // Button text varies by notification type
                      {notification.type === 'user_unsubscribed' ? 'View Details' : 
                       notification.type === 'contact_form_submission' ? 'View Message' : 'View Email'}
                    </button>
                    
                    // Mark as read button (only for unread notifications)
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="flex items-center px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                      >
                        // Check circle icon
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

      // Email Preview Modal section comment
      {/* Email Preview Modal */}
      // Modal for previewing email content (conditional rendering)
      {showEmailPreview && selectedNotification && (
        // Modal overlay
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          // Modal content container
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            // Modal header
            <div className="flex items-center justify-between p-6 border-b">
              // Modal title
              <h3 className="text-xl font-bold">
                {selectedNotification.type === 'user_unsubscribed' ? 'Unsubscribe Details' : 
                 selectedNotification.type === 'contact_form_submission' ? 'Contact Form Message' : 'Email Preview'} - {selectedNotification.user_email}
              </h3>
              // Close button
              <button
                onClick={() => setShowEmailPreview(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                // Eye off icon
                <EyeOff className="w-5 h-5" />
              </button>
            </div>
            
            // Modal body with scrollable content
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              // Conditional content based on notification type
              {selectedNotification.type === 'user_unsubscribed' ? (
                // Unsubscribe details content
                <div className="space-y-4">
                  // Unsubscribe notification
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-red-900 mb-2">User Unsubscribed</h4>
                    <p className="text-red-800">
                      User {selectedNotification.user_email} has unsubscribed from email notifications.
                    </p>
                  </div>
                  // Unsubscribe details
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
                // Contact form submission content
                <div className="space-y-4">
                  // Contact form header
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Contact Form Submission</h4>
                    <p className="text-blue-800">
                      New message received from {selectedNotification.user_email}
                    </p>
                  </div>
                  
                  // Contact form details (if available)
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
                  
                  // Contact form message content (if available)
                  {selectedNotification.notification_data.contact_form_data?.message && (
                    <div className="bg-white p-4 rounded-lg border">
                      <h4 className="font-semibold mb-2">Message:</h4>
                      <div className="whitespace-pre-wrap text-gray-800">
                        {selectedNotification.notification_data.contact_form_data.message}
                      </div>
                    </div>
                  )}
                  
                  // Action required section
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
                // Email content preview (HTML rendering)
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: selectedNotification.notification_data.email_html || 
                           selectedNotification.notification_data.welcome_email_html || 
                           '<p>No email content available</p>'
                  }}
                />
              )}
            </div>
            
            // Modal footer
            <div className="p-6 border-t bg-gray-50">
              // Footer content with email details and close button
              <div className="flex items-center justify-between">
                // Email metadata
                <div className="text-sm text-gray-600">
                  <p><strong>Sent to:</strong> {selectedNotification.user_email}</p>
                  <p><strong>Time:</strong> {new Date(selectedNotification.notification_data.sent_at || selectedNotification.notification_data.registration_time || selectedNotification.created_at).toLocaleString()}</p>
                  {selectedNotification.notification_data.email_subject && (
                    <p><strong>Subject:</strong> {selectedNotification.notification_data.email_subject}</p>
                  )}
                </div>
                // Close modal button
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

// Export the AdminNotifications component as the default export
export default AdminNotifications;import React, { useEffect, useState } from 'react';
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