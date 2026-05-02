-- Store required first and last names for email-auth profiles.

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS first_name TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS last_name TEXT NOT NULL DEFAULT '';

UPDATE profiles
SET
  first_name = COALESCE(NULLIF(first_name, ''), split_part(full_name, ' ', 1), ''),
  last_name = COALESCE(
    NULLIF(last_name, ''),
    NULLIF(trim(regexp_replace(full_name, '^\S+\s*', '')), ''),
    ''
  )
WHERE (first_name = '' OR last_name = '')
  AND COALESCE(full_name, '') <> '';

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    profile_first_name TEXT := COALESCE(NEW.raw_user_meta_data->>'first_name', '');
    profile_last_name TEXT := COALESCE(NEW.raw_user_meta_data->>'last_name', '');
    profile_full_name TEXT := trim(COALESCE(NEW.raw_user_meta_data->>'full_name', trim(profile_first_name || ' ' || profile_last_name), ''));
BEGIN
    INSERT INTO public.profiles (id, full_name, username, first_name, last_name, email)
    VALUES (
        NEW.id,
        profile_full_name,
        COALESCE(NEW.raw_user_meta_data->>'username', profile_full_name),
        profile_first_name,
        profile_last_name,
        NEW.email
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = COALESCE(NULLIF(EXCLUDED.full_name, ''), profiles.full_name),
        username = COALESCE(NULLIF(EXCLUDED.username, ''), profiles.username),
        first_name = COALESCE(NULLIF(EXCLUDED.first_name, ''), profiles.first_name),
        last_name = COALESCE(NULLIF(EXCLUDED.last_name, ''), profiles.last_name),
        email = COALESCE(EXCLUDED.email, profiles.email),
        updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
