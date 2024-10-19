-- supabase/seed.sql
--
-- create test users
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  invited_at,
  confirmation_token,
  confirmation_sent_at,
  recovery_token,
  recovery_sent_at,
  email_change_token_new,
  email_change,
  email_change_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at,
  phone,
  phone_confirmed_at,
  phone_change,
  phone_change_token,
  phone_change_sent_at,
  email_change_token_current,
  email_change_confirm_status,
  banned_until,
  reauthentication_token,
  reauthentication_sent_at
)
VALUES 
  (
    '00000000-0000-0000-0000-000000000000',
    '00000000-0000-0000-0000-000000000000',
    'service_role',
    'service_role', -- Role for admin
    'admin@gearcloset.com',
    extensions.crypt('password', extensions.gen_salt('bf')),
    timezone('utc'::text, now()),
    NULL,
    '',
    NULL,
    '',
    NULL,
    '',
    '',
    NULL,
    NULL,
    '{"provider": "email", "providers": ["email"]}',
    '{}',
    TRUE,
    timezone('utc'::text, now()),
    timezone('utc'::text, now()),
    NULL,
    NULL,
    '',
    '',
    NULL,
    '',
    0,
    NULL,
    '',
    NULL
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    uuid_generate_v4 (),
    'authenticated',
    'authenticated', -- Role for regular user
    'jimmiejackson414@gmail.com',
    extensions.crypt('password', extensions.gen_salt('bf')),
    timezone('utc'::text, now()),
    NULL,
    '',
    NULL,
    '',
    NULL,
    '',
    '',
    NULL,
    NULL,
    '{"provider": "email", "providers": ["email"]}',
    '{}',
    FALSE,
    timezone('utc'::text, now()),
    timezone('utc'::text, now()),
    NULL,
    NULL,
    '',
    '',
    NULL,
    '',
    0,
    NULL,
    '',
    NULL
  );

-- Common INSERT for auth.identities
INSERT INTO auth.identities (
  id,
  provider_id,
  user_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
)
VALUES 
  (
    uuid_generate_v4 (),
    uuid_generate_v4 (),
    (SELECT id FROM auth.users WHERE email = 'admin@gearcloset.com'), -- Use a subquery to get the correct user id
    format('{"sub":"%s","email":"%s"}', (SELECT id FROM auth.users WHERE email = 'admin@gearcloset.com')::text, 'admin@gearcloset.com')::jsonb,
    'email',
    timezone('utc'::text, now()),
    timezone('utc'::text, now()),
    timezone('utc'::text, now())
  ),
  (
    uuid_generate_v4 (),
    uuid_generate_v4 (),
    (SELECT id FROM auth.users WHERE email = 'jimmiejackson414@gmail.com'), -- Use a subquery to get the correct user id
    format('{"sub":"%s","email":"%s"}', (SELECT id FROM auth.users WHERE email = 'jimmiejackson414@gmail.com')::text, 'jimmiejackson414@gmail.com')::jsonb,
    'email',
    timezone('utc'::text, now()),
    timezone('utc'::text, now()),
    timezone('utc'::text, now())
  );
