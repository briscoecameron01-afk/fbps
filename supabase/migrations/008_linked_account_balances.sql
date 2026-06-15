-- Persist Plaid account balances for display in the app.

ALTER TABLE linked_accounts
  ADD COLUMN IF NOT EXISTS balance_available DECIMAL(12,2),
  ADD COLUMN IF NOT EXISTS balance_current DECIMAL(12,2),
  ADD COLUMN IF NOT EXISTS balance_iso_currency_code TEXT,
  ADD COLUMN IF NOT EXISTS balance_unofficial_currency_code TEXT,
  ADD COLUMN IF NOT EXISTS balance_last_synced_at TIMESTAMPTZ;
