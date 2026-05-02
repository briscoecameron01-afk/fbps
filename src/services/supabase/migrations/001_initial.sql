-- ══════════════════════════════════════════════════════════
-- Fractional Bill Pay — Supabase Database Schema
-- Run this in the Supabase SQL Editor to set up your database
-- ══════════════════════════════════════════════════════════

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Profiles (extends Supabase auth.users) ─────────────
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL DEFAULT '',
    avatar_url TEXT,
    subscription TEXT NOT NULL DEFAULT 'free' CHECK (subscription IN ('free', 'premium')),
    default_cadence TEXT NOT NULL DEFAULT 'daily' CHECK (default_cadence IN ('daily', 'weekly', 'biweekly')),
    notifications_enabled BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Bills ───────────────────────────────────────────────
CREATE TABLE bills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    due_day INTEGER NOT NULL CHECK (due_day BETWEEN 1 AND 31),
    category TEXT NOT NULL DEFAULT 'other'
        CHECK (category IN ('housing', 'transport', 'utilities', 'insurance', 'subscriptions', 'loans', 'other')),
    icon TEXT NOT NULL DEFAULT '📋',
    cadence TEXT NOT NULL DEFAULT 'daily'
        CHECK (cadence IN ('daily', 'weekly', 'biweekly')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    auto_pay BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Bill Buckets (funding progress per billing period) ──
CREATE TABLE bill_buckets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bill_id UUID NOT NULL REFERENCES bills(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    target_amount DECIMAL(10,2) NOT NULL,
    current_amount DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (current_amount >= 0),
    billing_period DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'funding'
        CHECK (status IN ('funding', 'ready', 'paid')),
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(bill_id, billing_period)
);

-- ── Contributions (individual micro-payments) ───────────
CREATE TABLE contributions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bill_id UUID NOT NULL REFERENCES bills(id) ON DELETE CASCADE,
    bucket_id UUID NOT NULL REFERENCES bill_buckets(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    status TEXT NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'completed', 'failed')),
    executed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Indexes ─────────────────────────────────────────────
CREATE INDEX idx_bills_user ON bills(user_id);
CREATE INDEX idx_bills_active ON bills(user_id) WHERE is_active = true;
CREATE INDEX idx_buckets_bill ON bill_buckets(bill_id, billing_period);
CREATE INDEX idx_buckets_user ON bill_buckets(user_id, status);
CREATE INDEX idx_contributions_bucket ON contributions(bucket_id);
CREATE INDEX idx_contributions_user ON contributions(user_id, created_at DESC);

-- ── Row Level Security ──────────────────────────────────
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE bill_buckets ENABLE ROW LEVEL SECURITY;
ALTER TABLE contributions ENABLE ROW LEVEL SECURITY;

-- Users can only read/write their own data
CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own bills"
    ON bills FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own bills"
    ON bills FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own bills"
    ON bills FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own bills"
    ON bills FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own buckets"
    ON bill_buckets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own buckets"
    ON bill_buckets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own buckets"
    ON bill_buckets FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own contributions"
    ON contributions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own contributions"
    ON contributions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ── Auto-create profile on signup ───────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── Auto-update updated_at timestamp ────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER bills_updated_at
    BEFORE UPDATE ON bills
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── Helper function: auto-mark bucket as 'ready' ───────
CREATE OR REPLACE FUNCTION check_bucket_ready()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE bill_buckets
    SET status = 'ready'
    WHERE id = NEW.bucket_id
      AND current_amount >= target_amount
      AND status = 'funding';
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER contribution_check_ready
    AFTER UPDATE ON bill_buckets
    FOR EACH ROW
    WHEN (NEW.current_amount >= NEW.target_amount AND OLD.status = 'funding')
    EXECUTE FUNCTION check_bucket_ready();
