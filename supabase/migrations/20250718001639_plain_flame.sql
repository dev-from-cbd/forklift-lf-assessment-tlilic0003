/*
  # Email System Setup
  Database migration to implement email preferences and notification system
  
  1. New Tables - Database table creation for email management
    - `user_preferences` - user email preferences and unsubscribe status - Main table for storing user email settings
    - Update `admin_notifications` to handle email events - Enhance existing notification system for email tracking

  2. Security - Row Level Security configuration and access control policies
    - Enable RLS on user_preferences - Activate security protection for user preferences
    - Users can read/update their own preferences - Allow users to manage their own email settings
    - Admins can read all preferences - Grant admin users access to all user preferences

  3. Functions - Database functions and triggers for email system automation
    - Email notification triggers - Automated triggers for email event handling
*/

-- Create user_preferences table - Create the main table for storing user email preferences and settings
CREATE TABLE IF NOT EXISTS user_preferences ( -- Create table only if it doesn't already exist
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), -- Primary key with auto-generated UUID
  user_id uuid NOT NULL, -- Foreign key reference to user, required field
  email text NOT NULL, -- User email address, required field
  email_notifications boolean DEFAULT true, -- Email notification preference, defaults to enabled
  marketing_emails boolean DEFAULT true, -- Marketing email preference, defaults to enabled
  unsubscribed_at timestamptz, -- Timestamp when user unsubscribed, optional field
  created_at timestamptz DEFAULT now(), -- Timestamp of record creation, defaults to current time
  updated_at timestamptz DEFAULT now(), -- Timestamp of last update, defaults to current time
  UNIQUE(user_id) -- Ensure each user can only have one preferences record
); -- End of table creation

-- Enable RLS
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies for user_preferences
CREATE POLICY "Users can read own preferences"
  ON user_preferences
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own preferences"
  ON user_preferences
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can insert own preferences"
  ON user_preferences
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Admin policies
CREATE POLICY "Admins can read all preferences"
  ON user_preferences
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur 
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    )
  );

-- Allow anonymous inserts for unsubscribe functionality
CREATE POLICY "Allow anonymous unsubscribe"
  ON user_preferences
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous unsubscribe updates"
  ON user_preferences
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id 
  ON user_preferences(user_id);

CREATE INDEX IF NOT EXISTS idx_user_preferences_email 
  ON user_preferences(email);

CREATE INDEX IF NOT EXISTS idx_user_preferences_notifications 
  ON user_preferences(email_notifications);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_user_preferences_updated_at ON user_preferences;
CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();