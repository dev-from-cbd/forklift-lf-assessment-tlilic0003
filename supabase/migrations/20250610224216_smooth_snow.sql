/*
  # Create Admin User and Fix Admin Access - Database migration to create admin user and ensure proper access

  1. New Functions - Functions added in this migration
    - `create_admin_user` - Function to create admin user if not exists with proper authentication setup
    - `ensure_admin_role` - Function to ensure admin role is set for existing users
    
  2. Security - Security measures and admin access control
    - Creates admin user with proper role - Sets up complete admin user with authentication
    - Ensures admin access works correctly - Validates and maintains admin privileges
*/

-- Function to create admin user if not exists - Create or replace function for admin user creation
CREATE OR REPLACE FUNCTION create_admin_user()
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
  -- Variable to store the admin user ID
  admin_user_id uuid;
  -- Variable to store the function result
  result json;
-- Begin the function logic
BEGIN
  -- Check if admin user already exists - Query auth.users table for existing admin
  SELECT id INTO admin_user_id
  -- From the auth.users table
  FROM auth.users
  -- Where email matches the admin email
  WHERE email = 'neoguru@gmail.com';

  -- If user doesn't exist, create it - Conditional user creation logic
  IF admin_user_id IS NULL THEN
    -- Insert into auth.users - Create new user record in authentication table
    INSERT INTO auth.users (
      -- Instance ID for multi-tenant support
      instance_id,
      -- Unique user identifier
      id,
      -- Audience claim for JWT
      aud,
      -- User role in authentication system
      role,
      -- User email address
      email,
      -- Encrypted password using bcrypt
      encrypted_password,
      -- Email confirmation timestamp
      email_confirmed_at,
      -- User creation timestamp
      created_at,
      -- Last update timestamp
      updated_at,
      -- Email confirmation token
      confirmation_token,
      -- Email change request
      email_change,
      -- New email change token
      email_change_token_new,
      -- Password recovery token
      recovery_token
    ) VALUES (
      -- Default instance ID for single tenant
      '00000000-0000-0000-0000-000000000000',
      -- Generate random UUID for user ID
      gen_random_uuid(),
      -- Set audience to authenticated
      'authenticated',
      -- Set role to authenticated user
      'authenticated',
      -- Admin email address
      'neoguru@gmail.com',
      -- Encrypt password 'admin123' with bcrypt
      crypt('admin123', gen_salt('bf')),
      -- Set email as confirmed immediately
      now(),
      -- Set creation time to current timestamp
      now(),
      -- Set update time to current timestamp
      now(),
      -- Empty confirmation token (already confirmed)
      '',
      -- Empty email change field
      '',
      -- Empty email change token
      '',
      -- Empty recovery token
      ''
    ) RETURNING id INTO admin_user_id;

    -- Insert into auth.identities - Create identity record for email provider
    INSERT INTO auth.identities (
      -- Unique identity identifier
      id,
      -- Reference to the user ID
      user_id,
      -- Identity data in JSON format
      identity_data,
      -- Authentication provider type
      provider,
      -- Last sign-in timestamp
      last_sign_in_at,
      -- Identity creation timestamp
      created_at,
      -- Identity update timestamp
      updated_at
    ) VALUES (
      -- Generate random UUID for identity ID
      gen_random_uuid(),
      -- Link to the created admin user
      admin_user_id,
      -- Format identity data with user ID and email
      format('{"sub":"%s","email":"%s"}', admin_user_id::text, 'neoguru@gmail.com')::jsonb,
      -- Set provider to email authentication
      'email',
      -- Set last sign-in to current time
      now(),
      -- Set creation time to current timestamp
      now(),
      -- Set update time to current timestamp
      now()
    );
  -- End of user creation conditional block
  END IF;

  -- Ensure admin role exists - Insert or update admin role for the user
  INSERT INTO user_roles (user_id, role)
  -- Values to insert: user ID and admin role
  VALUES (admin_user_id, 'admin')
  -- Handle conflict if user already has a role
  ON CONFLICT (user_id) DO UPDATE SET role = 'admin';

  -- Return success response with user details
  RETURN json_build_object(
    -- Success status
    'success', true, 
    -- Success message
    'message', 'Admin user created/updated successfully',
    -- User ID for reference
    'user_id', admin_user_id,
    -- Email address
    'email', 'neoguru@gmail.com',
    -- Default password (should be changed)
    'password', 'admin123'
  );
-- End of function
END;
-- End of function definition
$$;

-- Execute the function to create admin user - Call the function immediately after creation
SELECT create_admin_user();

-- Function to ensure admin role for existing users - Create or replace function for role assignment
CREATE OR REPLACE FUNCTION ensure_admin_role(user_email text)
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
  -- Variable to store the target user ID
  target_user_id uuid;
-- Begin the function logic
BEGIN
  -- Get user ID - Query auth.users table for user by email
  SELECT id INTO target_user_id
  -- From the auth.users table
  FROM auth.users
  -- Where email matches the provided email parameter
  WHERE email = user_email;

  -- Check if user was found
  IF target_user_id IS NULL THEN
    -- Return error response if user not found
    RETURN json_build_object('success', false, 'message', 'User not found');
  -- End of user existence check
  END IF;

  -- Set admin role - Insert or update user role to admin
  INSERT INTO user_roles (user_id, role)
  -- Values to insert: target user ID and admin role
  VALUES (target_user_id, 'admin')
  -- Handle conflict if user already has a role
  ON CONFLICT (user_id) DO UPDATE SET role = 'admin';

  -- Return success response
  RETURN json_build_object('success', true, 'message', 'Admin role assigned');
-- End of function
END;
-- End of function definition
$$;