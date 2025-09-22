/*
  # Admin Notifications System
  Database migration to implement admin notification functionality
  
  1. New Tables - Database table creation for notification management
    - `admin_notifications` - Main table for storing admin notifications
      - `id` (uuid, primary key) - Unique identifier for each notification
      - `type` (text) - notification type (e.g., 'new_user_registration') - Categorizes notification purpose
      - `user_id` (uuid) - related user ID - Links notification to specific user
      - `user_email` (text) - user email for quick reference - Stores email for easy access
      - `notification_data` (jsonb) - email content and metadata - Flexible JSON storage for notification details
      - `read` (boolean) - whether admin has read the notification - Tracks notification status
      - `created_at` (timestamptz) - Timestamp when notification was created

  2. Security - Row Level Security configuration and access control
    - Enable RLS on admin_notifications table - Activate security protection
    - Only admins can read notifications - Restrict access to admin users only
    - System can insert notifications - Allow automated notification creation
*/

-- Create admin_notifications table - Create the main table for storing admin notifications
CREATE TABLE IF NOT EXISTS admin_notifications ( -- Create table only if it doesn't already exist
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), -- Primary key with auto-generated UUID
  type text NOT NULL, -- Notification type field, cannot be null
  user_id uuid, -- Foreign key reference to user, optional field
  user_email text, -- User email address for quick reference
  notification_data jsonb, -- JSON data for flexible notification content storage
  read boolean DEFAULT false, -- Read status flag, defaults to unread (false)
  created_at timestamptz DEFAULT now() -- Timestamp of notification creation, defaults to current time
); -- End of table creation

-- Enable RLS - Enable Row Level Security for data protection
ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY; -- Apply RLS to admin_notifications table for secure access control

-- Create policy for admin access - Define access policy for admin users to read notifications
CREATE POLICY "Admins can read all notifications" -- Policy name: Allow admins to read all notifications
  ON admin_notifications -- Apply policy to admin_notifications table
  FOR SELECT -- Allow SELECT operations for reading data
  TO authenticated -- Apply to authenticated users only
  USING ( -- Access control condition starts here
    EXISTS ( -- Check if condition exists
      SELECT 1 FROM user_roles ur  -- Query user_roles table with alias 'ur'
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin' -- Check if current user has admin role
    ) -- End of EXISTS condition
  ); -- End of policy creation

-- Create policy for admin updates (marking as read) - Define policy for admin users to update notification status
CREATE POLICY "Admins can update notifications" -- Policy name: Allow admins to update notifications
  ON admin_notifications -- Apply policy to admin_notifications table
  FOR UPDATE -- Allow UPDATE operations for modifying data
  TO authenticated -- Apply to authenticated users only
  USING ( -- Access control condition for existing records
    EXISTS ( -- Check if condition exists for USING clause
      SELECT 1 FROM user_roles ur  -- Query user_roles table with alias 'ur'
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin' -- Check if current user has admin role
    ) -- End of EXISTS condition for USING
  ) -- End of USING clause
  WITH CHECK ( -- Additional validation for updated data
    EXISTS ( -- Check if condition exists for WITH CHECK clause
      SELECT 1 FROM user_roles ur  -- Query user_roles table with alias 'ur'
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin' -- Check if current user has admin role
    ) -- End of EXISTS condition for WITH CHECK
  ); -- End of policy creation

-- Create policy for system inserts (from edge functions) - Define policy for automated system notification creation
CREATE POLICY "System can insert notifications" -- Policy name: Allow system to insert notifications
  ON admin_notifications -- Apply policy to admin_notifications table
  FOR INSERT -- Allow INSERT operations for creating new records
  TO service_role -- Apply to service_role (system/automated processes)
  WITH CHECK (true); -- Always allow inserts from service role (no additional conditions)

-- Create index for performance - Create database indexes to improve query performance
CREATE INDEX IF NOT EXISTS idx_admin_notifications_created_at  -- Create index on created_at column if it doesn't exist
  ON admin_notifications(created_at DESC); -- Index on created_at column in descending order for recent notifications first

CREATE INDEX IF NOT EXISTS idx_admin_notifications_type  -- Create index on type column if it doesn't exist
  ON admin_notifications(type); -- Index on type column for filtering by notification type

CREATE INDEX IF NOT EXISTS idx_admin_notifications_read  -- Create index on read column if it doesn't exist
  ON admin_notifications(read); -- Index on read column for filtering by read status