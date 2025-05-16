/*
  # Optimize user_roles RLS policy

  1. Changes
    - Drop existing RLS policy
    - Create new optimized policy using subquery
    
  2. Security
    - Maintains same security rules
    - Improves query performance
*/

-- Drop existing policy
DROP POLICY IF EXISTS "Admins can read all user_roles" ON user_roles;

-- Create optimized policy
CREATE POLICY "Admins can read all user_roles"
  ON user_roles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 
      FROM user_roles ur
      WHERE ur.user_id = (SELECT auth.uid())
      AND ur.role = 'admin'
    )
  );