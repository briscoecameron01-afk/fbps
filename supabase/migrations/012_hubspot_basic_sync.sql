-- Basic HubSpot CRM contact sync.

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS hubspot_contact_id TEXT,
  ADD COLUMN IF NOT EXISTS hubspot_last_synced_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS hubspot_sync_error TEXT;

CREATE INDEX IF NOT EXISTS idx_profiles_hubspot_contact_id
  ON profiles(hubspot_contact_id)
  WHERE hubspot_contact_id IS NOT NULL;
