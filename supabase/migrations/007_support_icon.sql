-- Add icon column to support_types table
ALTER TABLE support_types ADD COLUMN IF NOT EXISTS icon text NOT NULL DEFAULT 'Headset';
