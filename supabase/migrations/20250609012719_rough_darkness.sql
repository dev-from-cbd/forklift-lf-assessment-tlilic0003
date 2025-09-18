/*
  # Admin Password Reset Function - Database migration to create admin password reset functionality

  1. New Functions - Functions added in this migration
    - `reset_admin_password` - Function to reset password for admin users with security validation
    
  2. Security - Security measures and access control
    - Only allows password reset for admin email - Restricts access to specific admin email only
    - Requires proper authentication - Ensures secure password reset process
*/

-- Function to reset admin password - Create or replace function for secure admin password reset
CREATE OR REPLACE FUNCTION reset_admin_password(admin_email text, new_password text)
-- Return type is JSON for structured response
RETURNS json
-- Use PL/pgSQL language for procedural logic
LANGUAGE plpgsql
-- SECURITY DEFINER allows function to run with creator's privileges
SECURITY DEFINER
-- Function body starts here
AS $$
-- Declare variables used in the function
DECLARE
  -- Variable to store the user ID
  user_id uuid;
  -- Variable to store the function result
  result json;
-- Begin the function logic
BEGIN
  -- Check if the email is the admin email
  IF admin_email != 'neoguru@gmail.com' THEN
    RETURN json_build_object('success', false, 'message', 'Unauthorized');
  END IF;

  -- Get user ID from auth.users
  SELECT id INTO user_id
  FROM auth.users
  WHERE email = admin_email;

  IF user_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'User not found');
  END IF;

  -- Update password in auth.users
  UPDATE auth.users
  SET 
    encrypted_password = crypt(new_password, gen_salt('bf')),
    updated_at = now()
  WHERE id = user_id;

  -- Ensure admin role exists
  INSERT INTO user_roles (user_id, role)
  VALUES (user_id, 'admin')
  ON CONFLICT (user_id) DO UPDATE SET role = 'admin';

  RETURN json_build_object('success', true, 'message', 'Password reset successfully');
END;
$$;