// Import React library with hooks for state management and side effects
import React, { useEffect, useState } from 'react';
// Import Supabase client for database operations
import { supabase } from '../config/supabase';
// Import various icons from lucide-react for UI elements
import { 
  Bell,        // Bell icon for notifications
  Mail,        // Mail icon for email-related content
  User,        // User icon for user-related information
  Clock,       // Clock icon for timestamps
  Eye,         // Eye icon for viewing/preview functionality
  EyeOff,      // Eye-off icon for closing preview
  Loader2,     // Loading spinner icon
  AlertCircle, // Alert circle icon for error messages
  CheckCircle, // Check circle icon for success/completion
  RefreshCw    // Refresh icon for reload functionality
} from 'lucide-react';

// Interface defining the structure of an admin notification object
interface AdminNotification {
  id: string;                    // Unique identifier for the notification
  type: string;                  // Type of notification (e.g., 'email_confirmation', 'welcome_email')
  user_id: string;               // ID of the user associated with this notification
  user_email: string;            // Email address of the user
  notification_data: {           // Object containing notification-specific data
    email_subject?: string;           // Subject line of the email (optional)
    email_html?: string;              // HTML content of the email (optional)
    email_text?: string;              // Plain text content of the email (optional)
    admin_email?: string;             // Admin email address (optional)
    sent_at?: string;                 // Timestamp when email was sent (optional)
    welcome_email_html?: string;      // HTML content for welcome emails (optional)
    welcome_email_text?: string;      // Text content for welcome emails (optional)
    admin_notification_html?: string; // HTML content for admin notifications (optional)
    registration_time?: string;       // Timestamp of user registration (optional)
    unsubscribed_at?: string;         // Timestamp when user unsubscribed (optional)
    user_agent?: string;              // User's browser/device information (optional)
    submitted_at?: string;            // Timestamp when form was submitted (optional)
    contact_form_data?: {             // Contact form submission data (optional)
      type: string;                        // Type of contact form submission
      name: string;                        // Name of the person submitting the form
      email: string;                       // Email address from the form
      subject: string;                     // Subject of the contact message
      message: string;                     // Message content from the form
    };
  };
  read: boolean;                 // Flag indicating if notification has been read
  created_at: string;            // Timestamp when notification was created
}

// Main functional component for displaying and managing admin notifications
const AdminNotifications: React.FC = () => {
  // State to store the list of admin notifications
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  // State to track loading status while fetching notifications
  const [loading, setLoading] = useState(true);
  // State to store error messages if any operations fail
  const [error, setError] = useState('');
  // State to store the currently selected notification for detailed view
  const [selectedNotification, setSelectedNotification] = useState<AdminNotification | null>(null);
  // State to control the visibility of the email preview modal
  const [showEmailPreview, setShowEmailPreview] = useState(false);

  // Effect hook to initialize component and set up real-time subscriptions
  useEffect(() => {
    // Fetch initial notifications when component mounts
    fetchNotifications();
    
    // Set up real-time subscription for new notifications
    const subscription = supabase
      .channel('admin_notifications')                                    // Create a channel for admin notifications
      .on('postgres_changes',                                           // Listen for database changes
        { event: 'INSERT', schema: 'public', table: 'admin_notifications' }, // Listen for new inserts in admin_notifications table
        (payload) => {                                                  // Callback function when new notification is inserted
          console.log('New notification received:', payload);           // Log the new notification payload
          fetchNotifications(); // Refresh notifications                // Refresh the notifications list
        }
      )
      .subscribe();                                                     // Subscribe to the channel

    // Cleanup function to unsubscribe when component unmounts
    return () => {
      subscription.unsubscribe();                                       // Unsubscribe from the real-time channel
    };
  }, []);                                                               // Empty dependency array means this runs once on mount

  // Async function to fetch notifications from the database
  const fetchNotifications = async () => {
    try {
      setLoading(true);                                                 // Set loading state to true
      setError('');                                                     // Clear any previous errors

      // Query the admin_notifications table
      const { data, error: fetchError } = await supabase
        .from('admin_notifications')                                    // Select from admin_notifications table
        .select('*')                                                    // Select all columns
        .order('created_at', { ascending: false })                      // Order by creation date, newest first
        .limit(50);                                                     // Limit to 50 most recent notifications

      // Check if there was an error in the query
      if (fetchError) {
        throw fetchError;                                               // Throw error to be caught by catch block
      }

      // Update notifications state with fetched data
      setNotifications(data || []);                                     // Set notifications or empty array if data is null
    } catch (err) {
      console.error('Error fetching notifications:', err);              // Log error to console
      setError('Failed to load notifications');                        // Set user-friendly error message
    } finally {
      setLoading(false);                                                // Set loading to false regardless of success/failure
    }
  };

  // Async function to mark a specific notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      // Update the notification in the database to mark it as read
      const { error } = await supabase
        .from('admin_notifications')                                    // Select admin_notifications table
        .update({ read: true })                                         // Update read field to true
        .eq('id', notificationId);                                      // Where id matches the provided notificationId

      // Check if there was an error in the update operation
      if (error) throw error;                                           // Throw error to be caught by catch block

      // Update local state to reflect the change
      setNotifications(notifications.map(n =>                           // Map through all notifications
        n.id === notificationId ? { ...n, read: true } : n             // Update the matching notification's read status
      ));
    } catch (err) {
      console.error('Error marking notification as read:', err);        // Log error to console
    }
  };

  // Calculate the number of unread notifications
  const unreadCount = notifications.filter(n => !n.read).length;       // Filter unread notifications and get count

  // Show loading spinner while notifications are being fetched
  if (loading) {
    return (
      // Container for loading state with centered content
      <div className="flex items-center justify-center p-8">
        {/* Animated loading spinner icon */}
        <Loader2 className="w-6 h-6 animate-spin text-blue-600 mr-2" />
        {/* Loading text */}
        <span>Loading notifications...</span>
      </div>
    );
  }

  // Main component render when not loading
  return (
    // Main container with vertical spacing between sections
    <div className="space-y-6">
      {/* Header section with title and controls */}
      <div className="flex items-center justify-between">
        {/* Left side of header with title and unread count */}
        <div className="flex items-center">
          {/* Bell icon for notifications */}
          <Bell className="w-6 h-6 text-purple-600 mr-2" />
          {/* Main page title */}
          <h2 className="text-2xl font-bold">Admin Notifications</h2>
          {/* Conditional unread count badge */}
          {unreadCount > 0 && (
            // Red badge showing number of unread notifications
            <span className="ml-3 px-2 py-1 bg-red-500 text-white text-sm rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>
        {/* Right side of header with refresh button */}
        <button
          onClick={fetchNotifications}                                   // Click handler to refresh notifications
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {/* Refresh icon */}
          <RefreshCw className="w-4 h-4 mr-2" />
          {/* Button text */}
          Refresh
        </button>
      </div>

      {/* Error message display section */}
      {error && (
        // Error container with red background and styling
        <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center">
          {/* Alert circle icon for error indication */}
          <AlertCircle className="w-5 h-5 mr-2" />
          {/* Error message text */}
          {error}
        </div>
      )}

      {/* Notifications List section */}
      <div className="space-y-4">
        {/* Conditional rendering: empty state or notifications list */}
        {notifications.length === 0 ? (
          // Empty state when no notifications exist
          <div className="text-center py-8 text-gray-500">
            {/* Large bell icon for empty state */}
            <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            {/* Primary empty state message */}
            <p>No notifications yet</p>
            {/* Secondary explanatory message */}
            <p className="text-sm">You'll receive notifications when new users register</p>
          </div>
        ) : (
          // Map through notifications to render each one
          notifications.map((notification) => (
            // Individual notification card
            <div
              key={notification.id}                                      // Unique key for React list rendering
              className={`p-6 rounded-lg border-2 transition-colors ${   // Dynamic styling based on read status
                notification.read 
                  ? 'bg-gray-50 border-gray-200'                        // Gray styling for read notifications
                  : 'bg-blue-50 border-blue-200'                        // Blue styling for unread notifications
              }`}
            >
              {/* Main content container with space between elements */}
              <div className="flex items-start justify-between">
                {/* Left side content area */}
                <div className="flex-1">
                  {/* Header row with icon, title, and new badge */}
                  <div className="flex items-center mb-2">
                    {/* User icon for all notification types */}
                    <User className="w-5 h-5 text-blue-600 mr-2" />
                    {/* Dynamic title based on notification type */}
                    <h3 className="text-lg font-semibold">
                      {notification.type === 'email_confirmation' ? 'Email Confirmation Sent' :      // Email confirmation type
                       notification.type === 'welcome_email' ? 'Welcome Email Sent' :               // Welcome email type
                       notification.type === 'user_unsubscribed' ? 'User Unsubscribed' :            // Unsubscribe type
                       notification.type === 'contact_form_submission' ? 'Contact Form Submission' : // Contact form type
                       'New User Registration'}                                                       // Default/fallback type
                    </h3>
                    {/* Conditional "NEW" badge for unread notifications */}
                    {!notification.read && (
                      // Blue badge indicating new/unread status
                      <span className="ml-2 px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
                        NEW
                      </span>
                    )}
                  </div>
                  
                  {/* User information section */}
                  <div className="space-y-2 text-sm text-gray-600">
                    {/* User email row */}
                    <div className="flex items-center">
                      {/* Mail icon */}
                      <Mail className="w-4 h-4 mr-2" />
                      {/* User email address */}
                      <span className="font-medium">{notification.user_email}</span>
                    </div>
                    {/* Timestamp row */}
                    <div className="flex items-center">
                      {/* Clock icon */}
                      <Clock className="w-4 h-4 mr-2" />
                      {/* Formatted creation timestamp */}
                      <span>
                        {new Date(notification.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Action buttons section */}
                  <div className="mt-4 flex items-center space-x-4">
                    {/* View/Preview button */}
                    <button
                      onClick={() => {                                    // Click handler to open preview modal
                        setSelectedNotification(notification);           // Set the selected notification
                        setShowEmailPreview(true);                       // Show the preview modal
                      }}
                      className="flex items-center px-3 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
                    >
                      {/* Eye icon for viewing */}
                      <Eye className="w-4 h-4 mr-1" />
                      {/* Dynamic button text based on notification type */}
                      {notification.type === 'user_unsubscribed' ? 'View Details' :      // Unsubscribe details
                       notification.type === 'contact_form_submission' ? 'View Message' : // Contact form message
                       'View Email'}                                                      // Default email view
                    </button>
                    
                    {/* Conditional "Mark as Read" button for unread notifications */}
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}      // Click handler to mark as read
                        className="flex items-center px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                      >
                        {/* Check circle icon */}
                        <CheckCircle className="w-4 h-4 mr-1" />
                        {/* Button text */}
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

      {/* Email Preview Modal section */}
      {showEmailPreview && selectedNotification && (
        // Modal overlay with dark background
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          {/* Modal content container */}
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal header with title and close button */}
            <div className="flex items-center justify-between p-6 border-b">
              {/* Dynamic modal title based on notification type */}
              <h3 className="text-xl font-bold">
                {selectedNotification.type === 'user_unsubscribed' ? 'Unsubscribe Details' :      // Unsubscribe details title
                 selectedNotification.type === 'contact_form_submission' ? 'Contact Form Message' : // Contact form title
                 'Email Preview'} - {selectedNotification.user_email}                              // Default email preview title with user email
              </h3>
              {/* Close button */}
              <button
                onClick={() => setShowEmailPreview(false)}              // Click handler to close modal
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                {/* Eye-off icon for closing */}
                <EyeOff className="w-5 h-5" />
              </button>
            </div>
            
            {/* Modal body content with scrollable area */}
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              {/* Conditional content based on notification type - Unsubscribe case */}
              {selectedNotification.type === 'user_unsubscribed' ? (
                // Container for unsubscribe details
                <div className="space-y-4">
                  {/* Main unsubscribe notification box */}
                  <div className="bg-red-50 p-4 rounded-lg">
                    {/* Unsubscribe header */}
                    <h4 className="font-semibold text-red-900 mb-2">User Unsubscribed</h4>
                    {/* Unsubscribe description */}
                    <p className="text-red-800">
                      User {selectedNotification.user_email} has unsubscribed from email notifications.
                    </p>
                  </div>
                  {/* Details section */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    {/* Details header */}
                    <h4 className="font-semibold mb-2">Details:</h4>
                    {/* Details list */}
                    <ul className="space-y-1 text-sm">
                      {/* User email */}
                      <li><strong>Email:</strong> {selectedNotification.user_email}</li>
                      {/* Unsubscribe timestamp */}
                      <li><strong>Unsubscribed at:</strong> {selectedNotification.notification_data.unsubscribed_at ? new Date(selectedNotification.notification_data.unsubscribed_at).toLocaleString() : 'Unknown'}</li>
                      {/* User agent information */}
                      <li><strong>User Agent:</strong> {selectedNotification.notification_data.user_agent || 'Unknown'}</li>
                    </ul>
                  </div>
                </div>
              // Contact form submission case
              ) : selectedNotification.type === 'contact_form_submission' ? (
                // Container for contact form details
                <div className="space-y-4">
                  {/* Main contact form notification box */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    {/* Contact form header */}
                    <h4 className="font-semibold text-blue-900 mb-2">Contact Form Submission</h4>
                    {/* Contact form description */}
                    <p className="text-blue-800">
                      New message received from {selectedNotification.user_email}
                    </p>
                  </div>
                  
                  {/* Conditional rendering of contact form data if it exists */}
                  {selectedNotification.notification_data.contact_form_data && (
                    // Message details section
                    <div className="bg-gray-50 p-4 rounded-lg">
                      {/* Message details header */}
                      <h4 className="font-semibold mb-2">Message Details:</h4>
                      {/* Details container */}
                      <div className="space-y-2 text-sm">
                        {/* Contact form type */}
                        <p><strong>Type:</strong> {selectedNotification.notification_data.contact_form_data.type}</p>
                        {/* Sender name */}
                        <p><strong>Name:</strong> {selectedNotification.notification_data.contact_form_data.name}</p>
                        {/* Sender email */}
                        <p><strong>Email:</strong> {selectedNotification.notification_data.contact_form_data.email}</p>
                        {/* Message subject */}
                        <p><strong>Subject:</strong> {selectedNotification.notification_data.contact_form_data.subject}</p>
                        {/* Submission timestamp */}
                        <p><strong>Submitted:</strong> {selectedNotification.notification_data.submitted_at ? new Date(selectedNotification.notification_data.submitted_at).toLocaleString() : 'Unknown'}</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Conditional rendering of message content if it exists */}
                  {selectedNotification.notification_data.contact_form_data?.message && (
                    // Message content section
                    <div className="bg-white p-4 rounded-lg border">
                      {/* Message content header */}
                      <h4 className="font-semibold mb-2">Message:</h4>
                      {/* Message text with preserved whitespace */}
                      <div className="whitespace-pre-wrap text-gray-800">
                        {selectedNotification.notification_data.contact_form_data.message}
                      </div>
                    </div>
                  )}
                  
                  {/* Action required section */}
                  <div className="bg-green-50 p-4 rounded-lg">
                    {/* Action required header */}
                    <h4 className="font-semibold text-green-900 mb-2">Action Required:</h4>
                    {/* Action instructions with mailto link */}
                    <p className="text-green-800">
                      Please respond to this inquiry by replying directly to: 
                      {/* Mailto link for direct email response */}
                      <a href={`mailto:${selectedNotification.user_email}`} className="font-semibold underline ml-1">
                        {selectedNotification.user_email}
                      </a>
                    </p>
                  </div>
                </div>
              // Default case for email content display
              ) : (
                // Email content display using dangerouslySetInnerHTML
                <div 
                  dangerouslySetInnerHTML={{                              // Render HTML content directly
                    __html: selectedNotification.notification_data.email_html ||           // Try email_html first
                           selectedNotification.notification_data.welcome_email_html ||    // Then welcome_email_html
                           '<p>No email content available</p>'                             // Fallback message
                  }}
                />
              )}
            </div>
            
            {/* Modal footer with metadata and close button */}
            <div className="p-6 border-t bg-gray-50">
              {/* Footer content container */}
              <div className="flex items-center justify-between">
                {/* Left side: Email metadata */}
                <div className="text-sm text-gray-600">
                  {/* Recipient email */}
                  <p><strong>Sent to:</strong> {selectedNotification.user_email}</p>
                  {/* Timestamp - try multiple possible timestamp fields */}
                  <p><strong>Time:</strong> {new Date(selectedNotification.notification_data.sent_at || selectedNotification.notification_data.registration_time || selectedNotification.created_at).toLocaleString()}</p>
                  {/* Conditional email subject display */}
                  {selectedNotification.notification_data.email_subject && (
                    <p><strong>Subject:</strong> {selectedNotification.notification_data.email_subject}</p>
                  )}
                </div>
                {/* Right side: Close button */}
                <button
                  onClick={() => setShowEmailPreview(false)}            // Click handler to close modal
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  {/* Close button text */}
                  Close
                </button>
              </div>
            </div> {/* End of modal content container */}
          </div> {/* End of modal overlay */}
        </div> {/* End of modal section */}
      )} {/* End of conditional modal rendering */}
    </div> {/* End of main container */}
  );
};

// Export AdminNotifications component as default export
export default AdminNotifications;