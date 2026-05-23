-- Prevent duplicate linked bank accounts per user.

ALTER TABLE linked_accounts
  ADD COLUMN IF NOT EXISTS account_fingerprint TEXT,
  ADD COLUMN IF NOT EXISTS plaid_persistent_account_id TEXT;

UPDATE linked_accounts
SET account_fingerprint = lower(concat_ws(
  ':',
  'fallback',
  coalesce(institution_id, ''),
  coalesce(account_name, ''),
  coalesce(account_mask, ''),
  coalesce(account_type, ''),
  coalesce(account_subtype, '')
))
WHERE account_fingerprint IS NULL;

WITH ranked AS (
  SELECT
    id,
    row_number() OVER (
      PARTITION BY user_id, account_fingerprint
      ORDER BY is_primary DESC, updated_at DESC, created_at DESC, id DESC
    ) AS duplicate_rank
  FROM linked_accounts
  WHERE is_active = true
    AND account_fingerprint IS NOT NULL
)
UPDATE linked_accounts
SET
  is_active = false,
  is_primary = false,
  updated_at = now()
WHERE id IN (
  SELECT id
  FROM ranked
  WHERE duplicate_rank > 1
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_linked_accounts_user_fingerprint_active
  ON linked_accounts(user_id, account_fingerprint)
  WHERE is_active = true
    AND account_fingerprint IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_linked_accounts_user_active
  ON linked_accounts(user_id, is_active);
