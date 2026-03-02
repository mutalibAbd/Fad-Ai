-- Add color column to support_types for icon background color
ALTER TABLE support_types ADD COLUMN IF NOT EXISTS color varchar DEFAULT NULL;
