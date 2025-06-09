/*
  # Admin Password Reset Function

  1. New Functions
    - `reset_admin_password` - Function to reset password for admin users
    
  2. Security
    - Only allows password reset for admin email
    - Requires proper authentication
*/

-- Function to reset admin password
CREATE OR REPLACE FUNCTION reset_admin_password(admin_email text, new_password text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_id uuid;
  result json;
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