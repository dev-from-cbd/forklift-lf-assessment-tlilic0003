/*
  # Admin Notifications System

  1. New Tables
    - `admin_notifications`
      - `id` (uuid, primary key)
      - `type` (text) - notification type (e.g., 'new_user_registration')
      - `user_id` (uuid) - related user ID
      - `user_email` (text) - user email for quick reference
      - `notification_data` (jsonb) - email content and metadata
      - `read` (boolean) - whether admin has read the notification
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on admin_notifications table
    - Only admins can read notifications
    - System can insert notifications
*/

-- Create admin_notifications table
CREATE TABLE IF NOT EXISTS admin_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  user_id uuid,
  user_email text,
  notification_data jsonb,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY;

-- Create policy for admin access
CREATE POLICY "Admins can read all notifications"
  ON admin_notifications
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur 
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    )
  );

-- Create policy for admin updates (marking as read)
CREATE POLICY "Admins can update notifications"
  ON admin_notifications
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur 
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles ur 
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    )
  );

-- Create policy for system inserts (from edge functions)
CREATE POLICY "System can insert notifications"
  ON admin_notifications
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_admin_notifications_created_at 
  ON admin_notifications(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_admin_notifications_type 
  ON admin_notifications(type);

CREATE INDEX IF NOT EXISTS idx_admin_notifications_read 
  ON admin_notifications(read);