/*
  # Optimize user_progress RLS policy

  1. Changes
    - Drop existing policy
    - Create optimized policy that evaluates auth.uid() only once
    - Maintain same security rules but with better performance

  2. Security
    - Users can still only read their own progress
    - Admins can read all progress
*/

-- Drop existing policy
DROP POLICY IF EXISTS "Users can read their own progress" ON user_progress;

-- Create optimized policy
CREATE POLICY "Users can read their own progress"
  ON user_progress
  FOR SELECT
  TO authenticated
  USING (
    user_id = (SELECT auth.uid())
    OR EXISTS (
      SELECT 1 
      FROM user_roles ur
      WHERE ur.user_id = (SELECT auth.uid())
      AND ur.role = 'admin'
    )
  );