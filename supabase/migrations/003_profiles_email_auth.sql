-- Store email signup details for app profiles.

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS username TEXT,
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS plan TEXT NOT NULL DEFAULT 'freemium'
    CHECK (plan IN ('freemium', 'premium')),
  ADD COLUMN IF NOT EXISTS streak_days INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS employer_linked BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS pay_schedule TEXT NOT NULL DEFAULT 'daily'
    CHECK (pay_schedule IN ('daily', 'weekly', 'biweekly', 'monthly')),
  ADD COLUMN IF NOT EXISTS auto_transfer_enabled BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS auto_transfer_frequency TEXT NOT NULL DEFAULT 'daily'
    CHECK (auto_transfer_frequency IN ('daily', 'weekly', 'biweekly', 'monthly'));

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'profiles'
      AND policyname = 'Users can insert own profile'
  ) THEN
    CREATE POLICY "Users can insert own profile"
      ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, username, email)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'username', ''),
        COALESCE(NEW.raw_user_meta_data->>'username', ''),
        NEW.email
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
        username = COALESCE(EXCLUDED.username, profiles.username),
        email = COALESCE(EXCLUDED.email, profiles.email),
        updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
