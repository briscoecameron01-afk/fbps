-- Unit money movement support.

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS unit_customer_id TEXT,
  ADD COLUMN IF NOT EXISTS unit_deposit_account_id TEXT;

ALTER TABLE linked_accounts
  ADD COLUMN IF NOT EXISTS unit_counterparty_id TEXT,
  ADD COLUMN IF NOT EXISTS unit_counterparty_status TEXT,
  ADD COLUMN IF NOT EXISTS unit_counterparty_created_at TIMESTAMPTZ;

CREATE TABLE IF NOT EXISTS unit_transfers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  linked_account_id UUID REFERENCES linked_accounts(id) ON DELETE SET NULL,
  bill_id UUID REFERENCES bills(id) ON DELETE SET NULL,
  contribution_id UUID REFERENCES contributions(id) ON DELETE SET NULL,
  unit_payment_id TEXT UNIQUE,
  unit_counterparty_id TEXT,
  direction TEXT NOT NULL CHECK (direction IN ('to_unit', 'from_unit')),
  unit_direction TEXT NOT NULL CHECK (unit_direction IN ('Debit', 'Credit')),
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'pending',
  reason TEXT,
  description TEXT,
  idempotency_key TEXT UNIQUE NOT NULL,
  raw_response JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE contributions
  ADD COLUMN IF NOT EXISTS unit_transfer_id UUID REFERENCES unit_transfers(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS linked_account_id UUID REFERENCES linked_accounts(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_unit_transfers_user ON unit_transfers(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_unit_transfers_status ON unit_transfers(user_id, status);
CREATE INDEX IF NOT EXISTS idx_unit_transfers_payment ON unit_transfers(unit_payment_id);
CREATE INDEX IF NOT EXISTS idx_contributions_unit_transfer ON contributions(unit_transfer_id);
CREATE INDEX IF NOT EXISTS idx_contributions_linked_account ON contributions(linked_account_id);

ALTER TABLE unit_transfers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own Unit transfers" ON unit_transfers;
CREATE POLICY "Users can view own Unit transfers"
  ON unit_transfers FOR SELECT USING (auth.uid() = user_id);

DROP TRIGGER IF EXISTS unit_transfers_updated_at ON unit_transfers;
CREATE TRIGGER unit_transfers_updated_at
  BEFORE UPDATE ON unit_transfers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
