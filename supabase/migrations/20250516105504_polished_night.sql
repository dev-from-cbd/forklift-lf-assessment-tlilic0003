/*
  # Optimize user_progress RLS policy - Database migration to improve performance of user progress access

  1. Changes - Modifications made in this migration
    - Drop existing policy - Remove current RLS policy to avoid conflicts
    - Create optimized policy that evaluates auth.uid() only once - Improve performance by reducing function calls
    - Maintain same security rules but with better performance - Keep security intact while optimizing

  2. Security - Security considerations and access control rules
    - Users can still only read their own progress - Individual users access only their data
    - Admins can read all progress - Administrative users have full read access to all user progress
*/

-- Drop existing policy - Remove the current RLS policy if it exists to avoid conflicts
DROP POLICY IF EXISTS "Users can read their own progress" ON user_progress;

-- Create optimized policy - Create new RLS policy with improved performance characteristics
CREATE POLICY "Users can read their own progress"
  -- Apply this policy to the user_progress table
  ON user_progress
  -- This policy applies to SELECT operations (reading data)
  FOR SELECT
  -- Policy applies to authenticated users only
  TO authenticated
  -- Policy condition: user can read their own progress OR admin can read all progress
  USING (
    -- Check if the progress record belongs to the current user
    user_id = (SELECT auth.uid())
    -- OR check if current user is an admin (can read all progress)
    OR EXISTS (
      -- Subquery to find admin users
      SELECT 1 
      -- From user_roles table
      FROM user_roles ur
      -- Match current authenticated user ID
      WHERE ur.user_id = (SELECT auth.uid())
      -- User must have admin role
      AND ur.role = 'admin'
    )
  );