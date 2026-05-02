-- ══════════════════════════════════════════════════════════
-- Migration 002: Linked Bank Accounts (Plaid)
-- Run this in the Supabase SQL Editor AFTER 001_initial.sql
-- ══════════════════════════════════════════════════════════

-- ── Linked Bank Accounts ────────────────────────────────
CREATE TABLE IF NOT EXISTS linked_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    plaid_item_id TEXT NOT NULL,
    plaid_access_token TEXT NOT NULL,  -- Sensitive! Consider encrypting via Vault
    plaid_account_id TEXT NOT NULL UNIQUE,
    institution_name TEXT NOT NULL DEFAULT 'Unknown Bank',
    institution_id TEXT,
    account_name TEXT NOT NULL DEFAULT '',
    account_official_name TEXT,
    account_mask TEXT,  -- Last 4 digits
    account_type TEXT,  -- 'depository', 'credit', 'loan', etc.
    account_subtype TEXT,  -- 'checking', 'savings', 'credit card', etc.
    is_primary BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    last_synced_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Detected Bills (from transaction analysis) ──────────
CREATE TABLE IF NOT EXISTS detected_bills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    frequency TEXT NOT NULL DEFAULT 'monthly'
        CHECK (frequency IN ('monthly', 'weekly', 'biweekly')),
    category TEXT NOT NULL DEFAULT 'other',
    confidence DECIMAL(3,2) NOT NULL DEFAULT 0,
    last_seen DATE,
    is_dismissed BOOLEAN NOT NULL DEFAULT false,  -- User said "not a bill"
    is_added BOOLEAN NOT NULL DEFAULT false,      -- User added it to bills
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Indexes ─────────────────────────────────────────────
CREATE INDEX idx_linked_accounts_user ON linked_accounts(user_id);
CREATE INDEX idx_linked_accounts_item ON linked_accounts(plaid_item_id);
CREATE INDEX idx_detected_bills_user ON detected_bills(user_id) WHERE NOT is_dismissed;

-- ── Row Level Security ──────────────────────────────────
ALTER TABLE linked_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE detected_bills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own linked accounts"
    ON linked_accounts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own linked accounts"
    ON linked_accounts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own linked accounts"
    ON linked_accounts FOR DELETE USING (auth.uid() = user_id);
-- INSERT is done by Edge Functions using service role (bypasses RLS)

CREATE POLICY "Users can view own detected bills"
    ON detected_bills FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own detected bills"
    ON detected_bills FOR UPDATE USING (auth.uid() = user_id);

-- ── Auto-update timestamp ───────────────────────────────
CREATE TRIGGER linked_accounts_updated_at
    BEFORE UPDATE ON linked_accounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
