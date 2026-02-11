-- =====================================================
-- FADAI - Admin User Seed (local development)
-- =====================================================
-- GoTrue requires all text columns to be non-NULL.
-- The key column is `email_change` (index 8) which MUST
-- be '' not NULL, otherwise GoTrue throws:
--   "sql: Scan error on column index 8, name email_change:
--    converting NULL to string is unsupported"
-- =====================================================

DO $$
DECLARE
  admin_uid uuid := 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
BEGIN
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    role,
    aud,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token,
    email_change,
    email_change_token_new,
    email_change_confirm_status,
    phone,
    phone_change,
    phone_change_token,
    reauthentication_token,
    is_sso_user
  ) VALUES (
    admin_uid,
    '00000000-0000-0000-0000-000000000000',
    'fadai@gmail.com',
    crypt('!FadaiArzu2005!', gen_salt('bf')),
    NOW(),
    'authenticated',
    'authenticated',
    jsonb_build_object(
      'provider', 'email',
      'providers', jsonb_build_array('email'),
      'role', 'admin'
    ),
    '{}'::jsonb,
    FALSE,
    NOW(),
    NOW(),
    '',    -- confirmation_token
    '',    -- recovery_token
    '',    -- email_change (MUST be '' not NULL!)
    '',    -- email_change_token_new
    0,     -- email_change_confirm_status
    '',    -- phone
    '',    -- phone_change
    '',    -- phone_change_token
    '',    -- reauthentication_token
    FALSE  -- is_sso_user
  );

  INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
  ) VALUES (
    admin_uid,
    admin_uid,
    jsonb_build_object(
      'sub', admin_uid::text,
      'email', 'fadai@gmail.com',
      'email_verified', true,
      'phone_verified', false
    ),
    'email',
    admin_uid::text,
    NOW(),
    NOW(),
    NOW()
  );
END $$;
