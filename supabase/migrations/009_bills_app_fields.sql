-- Align bills with the app's current bill fields.

ALTER TABLE bills
  ADD COLUMN IF NOT EXISTS due_date DATE,
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS bill_type TEXT NOT NULL DEFAULT 'recurring'
    CHECK (bill_type IN ('recurring', 'one_time'));

ALTER TABLE bills
  DROP CONSTRAINT IF EXISTS bills_cadence_check;

ALTER TABLE bills
  ADD CONSTRAINT bills_cadence_check
  CHECK (cadence IN ('daily', 'weekly', 'biweekly', 'monthly'));

ALTER TABLE bills
  DROP CONSTRAINT IF EXISTS bills_category_check;

ALTER TABLE bills
  ADD CONSTRAINT bills_category_check
  CHECK (category IN ('housing', 'car', 'transport', 'utilities', 'insurance', 'subscriptions', 'loans', 'other'));

ALTER TABLE contributions
  ADD COLUMN IF NOT EXISTS funding_source TEXT;
