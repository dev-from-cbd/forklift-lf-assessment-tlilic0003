/*
  # Fix Admin Panel Database Setup - Database migration to fix admin panel functionality

  1. Tables - Database table creation and validation
    - Ensure `user_roles` table exists with proper structure - Creates table for user role management if not present
    - Ensure `user_progress` table exists with proper structure - Creates table for tracking user progress if not present
  
  2. Security - Row Level Security configuration and access policies
    - Enable RLS on both tables - Activate Row Level Security for data protection
    - Create policies for user access control - Set up access control policies for different user types
    - Admin users can access all data - Grant full data access to administrative users
    - Regular users can only access their own data - Restrict regular users to their own records
  
  3. Functions - Database function management and admin utilities
    - Drop existing functions to avoid conflicts - Remove old function definitions to prevent conflicts
    - Create helper functions for admin management - Build utility functions for administrative tasks
    - Function to get user ID by email - Create function to lookup user ID using email address
    - Function to ensure admin role assignment - Create function to assign admin privileges to users
*/

-- Ensure user_roles table exists - Create user_roles table if it doesn't already exist
CREATE TABLE IF NOT EXISTS user_roles (
  -- Primary key with auto-generated UUID
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Foreign key reference to auth.users table
  user_id uuid NOT NULL,
  -- User role type with default value 'user'
  role text NOT NULL DEFAULT 'user',
  -- Timestamp when role was created
  created_at timestamptz DEFAULT now(),
  -- Ensure each user can only have one role
  UNIQUE(user_id)
);

-- Ensure user_progress table exists - Create user_progress table if it doesn't already exist
CREATE TABLE IF NOT EXISTS user_progress (
  -- Primary key with auto-generated UUID
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Foreign key reference to auth.users table
  user_id uuid NOT NULL,
  -- Question identifier for tracking progress
  question_id integer NOT NULL,
  -- Whether the question was answered correctly
  correct boolean DEFAULT false,
  -- Number of attempts made on this question
  attempts integer DEFAULT 0,
  -- Timestamp of the last attempt
  last_attempt_at timestamptz DEFAULT now(),
  -- Ensure unique combination of user and question
  UNIQUE(user_id, question_id)
);

-- Enable RLS - Enable Row Level Security for data protection
-- Enable RLS on user_roles table for secure access control
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
-- Enable RLS on user_progress table for secure access control
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist - Clean up any existing policies to avoid conflicts
-- Drop user progress read policy if it exists
DROP POLICY IF EXISTS "Users can read their own progress" ON user_progress;
-- Drop user progress update policy if it exists
DROP POLICY IF EXISTS "Users can update their own progress" ON user_progress;
-- Drop admin read all roles policy if it exists
DROP POLICY IF EXISTS "Admins can read all user_roles" ON user_roles;
-- Drop user read own role policy if it exists
DROP POLICY IF EXISTS "Users can read own role" ON user_roles;
-- Drop admin manage roles policy if it exists
DROP POLICY IF EXISTS "Admins can manage roles" ON user_roles;

-- User progress policies - Row Level Security policies for user_progress table
-- Policy: Users can read their own progress data (admins can read all)
CREATE POLICY "Users can read their own progress"
  -- Apply policy to user_progress table
  ON user_progress
  -- Allow SELECT operations for reading data
  FOR SELECT
  -- Apply to authenticated users only
  TO authenticated
  -- Access control logic
  USING (
    -- User can access their own progress records
    user_id = auth.uid() OR 
    -- Admin users can access all progress records
    EXISTS (
      -- Check if current user has admin role
      SELECT 1 FROM user_roles ur 
      -- Match current user ID and admin role
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    )
  );

-- Policy: Users can update their own progress data
CREATE POLICY "Users can update their own progress"
  -- Apply policy to user_progress table
  ON user_progress
  -- Allow all operations (INSERT, UPDATE, DELETE)
  FOR ALL
  -- Apply to authenticated users only
  TO authenticated
  -- User can only modify their own progress records
  USING (user_id = auth.uid())
  -- Additional check for INSERT operations
  WITH CHECK (user_id = auth.uid());

-- User roles policies - Row Level Security policies for user_roles table
-- Policy: Users can read their own role information
CREATE POLICY "Users can read own role"
  -- Apply policy to user_roles table
  ON user_roles
  -- Allow SELECT operations for reading data
  FOR SELECT
  -- Apply to authenticated users only
  TO authenticated
  -- User can only access their own role record
  USING (user_id = auth.uid());

-- Policy: Admins can read all user roles
CREATE POLICY "Admins can read all user_roles"
  -- Apply policy to user_roles table
  ON user_roles
  -- Allow SELECT operations for reading data
  FOR SELECT
  -- Apply to authenticated users only
  TO authenticated
  -- Access control logic for admin users
  USING (
    -- Check if current user has admin role
    EXISTS (
      -- Query user_roles table for admin role
      SELECT 1 FROM user_roles ur 
      -- Match current user ID and admin role
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    )
  );

-- Policy: Admins can manage all user roles
CREATE POLICY "Admins can manage roles"
  -- Apply policy to user_roles table
  ON user_roles
  -- Allow all operations (INSERT, UPDATE, DELETE)
  FOR ALL
  -- Apply to authenticated users only
  TO authenticated
  -- Access control logic for admin users
  USING (
    -- Check if current user has admin role
    EXISTS (
      -- Query user_roles table for admin role
      SELECT 1 FROM user_roles ur 
      -- Match current user ID and admin role
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    )
  )
  -- Additional check for INSERT operations
  WITH CHECK (
    -- Verify admin role for data modification
    EXISTS (
      -- Query user_roles table for admin role
      SELECT 1 FROM user_roles ur 
      -- Match current user ID and admin role
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    )
  );

-- Drop existing functions to avoid conflicts - Remove old function definitions to prevent conflicts
-- Drop get_user_id_by_email function if it exists
DROP FUNCTION IF EXISTS get_user_id_by_email(text);
-- Drop ensure_admin_role function if it exists
DROP FUNCTION IF EXISTS ensure_admin_role(text);

-- Function to get user ID by email (for admin setup) - Utility function to find user ID by email address
-- Create or replace function for user ID lookup
CREATE OR REPLACE FUNCTION get_user_id_by_email(email_address text)
-- Return type is UUID for user identifier
RETURNS uuid
-- Function language is PL/pgSQL
LANGUAGE plpgsql
-- Security definer for elevated privileges
SECURITY DEFINER
-- Function body starts here
AS $$
-- Variable declarations section
DECLARE
  -- Variable to store the user UUID
  user_uuid uuid;
-- Function logic starts here
BEGIN
  -- Query to find user ID by email address
  SELECT id INTO user_uuid
  -- From the auth.users table
  FROM auth.users
  -- Where email matches the provided address
  WHERE email = email_address
  -- Limit to one result for safety
  LIMIT 1;
  
  -- Return the found user UUID (or NULL if not found)
  RETURN user_uuid;
-- End of get_user_id_by_email function
END;
$$;

-- Function to ensure admin role for specific email - Function to assign admin role to user by email
-- Create or replace function for admin role assignment
CREATE OR REPLACE FUNCTION ensure_admin_role(email_address text)
-- Return type is void (no return value)
RETURNS void
-- Function language is PL/pgSQL
LANGUAGE plpgsql
-- Security definer for elevated privileges
SECURITY DEFINER
-- Function body starts here
AS $$
-- Variable declarations section
DECLARE
  -- Variable to store the user UUID
  user_uuid uuid;
-- Function logic starts here
BEGIN
  -- Get user ID by email using helper function
  SELECT get_user_id_by_email(email_address) INTO user_uuid;
  
  -- If user exists, ensure admin role assignment
  IF user_uuid IS NOT NULL THEN
    -- Insert admin role for the user
    INSERT INTO user_roles (user_id, role)
    -- Values to insert: user ID and admin role
    VALUES (user_uuid, 'admin')
    -- Handle conflict if user already has a role
    ON CONFLICT (user_id) 
    -- Update existing role to admin
    DO UPDATE SET role = 'admin';
  -- End of user existence check
  END IF;
-- End of ensure_admin_role function
END;
$$;