-- Add columns that may have been appended after migration 009 was already applied.

ALTER TABLE bills
  ADD COLUMN IF NOT EXISTS description TEXT;

ALTER TABLE contributions
  ADD COLUMN IF NOT EXISTS funding_source TEXT;
