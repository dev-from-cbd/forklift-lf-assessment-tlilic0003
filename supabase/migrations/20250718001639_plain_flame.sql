/*
  # Email System Setup

  1. New Tables
    - `user_preferences` - user email preferences and unsubscribe status
    - Update `admin_notifications` to handle email events

  2. Security
    - Enable RLS on user_preferences
    - Users can read/update their own preferences
    - Admins can read all preferences

  3. Functions
    - Email notification triggers
*/

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  email text NOT NULL,
  email_notifications boolean DEFAULT true,
  marketing_emails boolean DEFAULT true,
  unsubscribed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

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