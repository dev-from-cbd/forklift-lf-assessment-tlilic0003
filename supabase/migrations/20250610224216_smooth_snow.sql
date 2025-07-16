/*
  # Create Admin User and Fix Admin Access

  1. New Functions
    - `create_admin_user` - Function to create admin user if not exists
    - `ensure_admin_role` - Function to ensure admin role is set
    
  2. Security
    - Creates admin user with proper role
    - Ensures admin access works correctly
*/

-- Function to create admin user if not exists
CREATE OR REPLACE FUNCTION create_admin_user()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  admin_user_id uuid;
  result json;
BEGIN
  -- Check if admin user already exists
  SELECT id INTO admin_user_id
  FROM auth.users
  WHERE email = 'neoguru@gmail.com';

  -- If user doesn't exist, create it
  IF admin_user_id IS NULL THEN
    -- Insert into auth.users
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'neoguru@gmail.com',
      crypt('admin123', gen_salt('bf')),
      now(),
      now(),
      now(),
      '',
      '',
      '',
      ''
    ) RETURNING id INTO admin_user_id;

    -- Insert into auth.identities
    INSERT INTO auth.identities (
      id,
      user_id,
      identity_data,
      provider,
      last_sign_in_at,
      created_at,
      updated_at
    ) VALUES (
      gen_random_uuid(),
      admin_user_id,
      format('{"sub":"%s","email":"%s"}', admin_user_id::text, 'neoguru@gmail.com')::jsonb,
      'email',
      now(),
      now(),
      now()
    );
  END IF;

  -- Ensure admin role exists
  INSERT INTO user_roles (user_id, role)
  VALUES (admin_user_id, 'admin')
  ON CONFLICT (user_id) DO UPDATE SET role = 'admin';

  RETURN json_build_object(
    'success', true, 
    'message', 'Admin user created/updated successfully',
    'user_id', admin_user_id,
    'email', 'neoguru@gmail.com',
    'password', 'admin123'
  );
END;
$$;

-- Execute the function to create admin user
SELECT create_admin_user();

-- Function to ensure admin role for existing users
CREATE OR REPLACE FUNCTION ensure_admin_role(user_email text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  target_user_id uuid;
BEGIN
  -- Get user ID
  SELECT id INTO target_user_id
  FROM auth.users
  WHERE email = user_email;

  IF target_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'User not found');
  END IF;

  -- Set admin role
  INSERT INTO user_roles (user_id, role)
  VALUES (target_user_id, 'admin')
  ON CONFLICT (user_id) DO UPDATE SET role = 'admin';

  RETURN json_build_object('success', true, 'message', 'Admin role assigned');
END;
$$;