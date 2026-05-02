-- Persist whether a user has finished the application onboarding flow.

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS has_completed_onboarding BOOLEAN NOT NULL DEFAULT false;

-- Existing profile rows predate this flag, so treat them as already set up.
UPDATE profiles
SET has_completed_onboarding = true
WHERE has_completed_onboarding = false;
