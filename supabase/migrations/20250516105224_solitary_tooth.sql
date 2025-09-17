/*
  # Optimize user_roles RLS policy - Database migration to improve RLS policy performance

  1. Changes - Modifications being made to the database
    - Drop existing RLS policy - Remove the current row-level security policy
    - Create new optimized policy using subquery - Implement improved version with better performance
    
  2. Security - Security considerations for this migration
    - Maintains same security rules - No changes to access control logic
    - Improves query performance - Optimizes database query execution speed
*/

-- Drop existing policy - Remove the current RLS policy if it exists to avoid conflicts
DROP POLICY IF EXISTS "Admins can read all user_roles" ON user_roles;

-- Create optimized policy - Create new RLS policy with improved performance characteristics
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
      -- Subquery to find admin users with optimized structure
      SELECT 1 
      -- From user_roles table with alias for clarity
      FROM user_roles ur
      -- Match current authenticated user ID using explicit subquery
      WHERE ur.user_id = (SELECT auth.uid())
      -- User must have admin role
      AND ur.role = 'admin'
    )
  );