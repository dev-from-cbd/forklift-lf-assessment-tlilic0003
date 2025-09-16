/*
  # Admin Schema Setup - Database migration for user roles and progress tracking

  1. New Tables - Creating two main tables for the application
    - `user_roles` - Table to manage user permissions and roles
      - `id` (uuid, primary key) - Unique identifier for each role record
      - `user_id` (uuid, references auth.users) - Foreign key linking to Supabase auth users
      - `role` (text, default 'user') - Role type (admin, user, etc.)
      - `created_at` (timestamp) - When the role was assigned

    - `user_progress` - Table to track user quiz/assessment progress
      - `id` (uuid, primary key) - Unique identifier for each progress record
      - `user_id` (uuid, references auth.users) - Foreign key linking to Supabase auth users
      - `question_id` (integer) - Identifier for the specific question
      - `correct` (boolean) - Whether the answer was correct
      - `attempts` (integer) - Number of attempts made on this question
      - `last_attempt_at` (timestamp) - When the last attempt was made

  2. Security - Row Level Security (RLS) configuration
    - Enable RLS on all tables - Ensures data access is controlled at row level
    - Add policies for admin access - Admins can access all data
    - Add policies for user access to their own progress - Users can only see their own data
*/

-- Create user_roles table - SQL command to create the user roles table
CREATE TABLE IF NOT EXISTS user_roles (
  -- Primary key column with auto-generated UUID
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Foreign key reference to Supabase auth.users table, cannot be null
  user_id uuid REFERENCES auth.users NOT NULL,
  -- Role type column with default value of 'user'
  role text NOT NULL DEFAULT 'user',
  -- Timestamp column for when the role was created, defaults to current time
  created_at timestamptz DEFAULT now(),
  -- Unique constraint to ensure one role per user
  UNIQUE(user_id)
);

-- Create user_progress table - SQL command to create the user progress tracking table
CREATE TABLE IF NOT EXISTS user_progress (
  -- Primary key column with auto-generated UUID
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Foreign key reference to Supabase auth.users table, cannot be null
  user_id uuid REFERENCES auth.users NOT NULL,
  -- Question identifier as integer, cannot be null
  question_id integer NOT NULL,
  -- Boolean flag indicating if the answer was correct, defaults to false
  correct boolean DEFAULT false,
  -- Counter for number of attempts made, defaults to 0
  attempts integer DEFAULT 0,
  -- Timestamp of the last attempt, defaults to current time
  last_attempt_at timestamptz DEFAULT now(),
  -- Unique constraint to ensure one progress record per user per question
  UNIQUE(user_id, question_id)
);

-- Enable RLS - Enable Row Level Security on both tables for data protection
-- Enable Row Level Security on user_roles table
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
-- Enable Row Level Security on user_progress table
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Create admin role policy - Security policy allowing admins to read all user roles
CREATE POLICY "Admins can read all user_roles"
  -- Apply this policy to the user_roles table
  ON user_roles
  -- This policy applies to SELECT operations (reading data)
  FOR SELECT
  -- Policy applies to authenticated users only
  TO authenticated
  -- Policy condition: user must have admin role to access all user_roles
  USING (
    -- Check if the current user exists in user_roles with admin role
    EXISTS (
      -- Subquery to find admin users
      SELECT 1 FROM user_roles
      -- Match current authenticated user ID
      WHERE user_roles.user_id = auth.uid()
      -- User must have admin role
      AND user_roles.role = 'admin'
    )
  );

-- Create user progress policies - Security policies for user progress data access
-- Policy allowing users to read their own progress data
CREATE POLICY "Users can read their own progress"
  -- Apply this policy to the user_progress table
  ON user_progress
  -- This policy applies to SELECT operations (reading data)
  FOR SELECT
  -- Policy applies to authenticated users only
  TO authenticated
  -- Policy condition: user can read their own progress OR user is admin
  USING (user_id = auth.uid() OR EXISTS (
    -- Subquery to check if user has admin role
    SELECT 1 FROM user_roles
    -- Match current authenticated user ID
    WHERE user_roles.user_id = auth.uid()
    -- User must have admin role
    AND user_roles.role = 'admin'
  ));

-- Policy allowing users to update their own progress data
CREATE POLICY "Users can update their own progress"
  -- Apply this policy to the user_progress table
  ON user_progress
  -- This policy applies to UPDATE operations (modifying data)
  FOR UPDATE
  -- Policy applies to authenticated users only
  TO authenticated
  -- Policy condition: user can only update their own progress records
  USING (user_id = auth.uid());

-- Insert initial admin user role - PL/pgSQL block to create initial admin user
-- DO block allows execution of procedural code in PostgreSQL
DO $$
-- BEGIN block starts the procedural code section
BEGIN
  -- Insert statement to add admin role for specific user
  INSERT INTO user_roles (user_id, role)
  -- Select user ID and assign admin role
  SELECT id, 'admin'
  -- From Supabase auth.users table
  FROM auth.users
  -- Filter for specific email address that should be admin
  WHERE email = 'neoguru@gmail.com'
  -- Handle conflict if user already has a role assigned
  ON CONFLICT (user_id) DO NOTHING;
-- END block closes the procedural code section
END $$;