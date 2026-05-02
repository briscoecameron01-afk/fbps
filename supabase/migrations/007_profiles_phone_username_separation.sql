-- Keep username separate from legal/profile name and allow a phone number.

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS phone_number TEXT;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    profile_first_name TEXT := COALESCE(NEW.raw_user_meta_data->>'first_name', '');
    profile_last_name TEXT := COALESCE(NEW.raw_user_meta_data->>'last_name', '');
    profile_full_name TEXT := trim(COALESCE(NEW.raw_user_meta_data->>'full_name', trim(profile_first_name || ' ' || profile_last_name), ''));
    profile_username TEXT := COALESCE(NEW.raw_user_meta_data->>'username', profile_full_name);
BEGIN
    INSERT INTO public.profiles (id, full_name, username, first_name, last_name, phone_number, email)
    VALUES (
        NEW.id,
        profile_full_name,
        profile_username,
        profile_first_name,
        profile_last_name,
        NEW.raw_user_meta_data->>'phone_number',
        NEW.email
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = COALESCE(NULLIF(EXCLUDED.full_name, ''), profiles.full_name),
        username = COALESCE(NULLIF(EXCLUDED.username, ''), profiles.username),
        first_name = COALESCE(NULLIF(EXCLUDED.first_name, ''), profiles.first_name),
        last_name = COALESCE(NULLIF(EXCLUDED.last_name, ''), profiles.last_name),
        phone_number = COALESCE(EXCLUDED.phone_number, profiles.phone_number),
        email = COALESCE(EXCLUDED.email, profiles.email),
        updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
