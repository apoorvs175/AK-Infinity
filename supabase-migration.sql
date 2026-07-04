
-- Complete migration script for clients table with region column
-- Run this in your Supabase SQL Editor

-- 1. First, create the clients table if it doesn't exist
CREATE TABLE IF NOT EXISTS clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_name TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  address_name TEXT NOT NULL,
  google_maps_link TEXT,
  owner_contact_number TEXT,
  first_call BOOLEAN DEFAULT FALSE,
  description TEXT,
  website BOOLEAN DEFAULT FALSE,
  collaboration BOOLEAN DEFAULT FALSE,
  first_meeting BOOLEAN DEFAULT FALSE,
  final_call BOOLEAN DEFAULT FALSE,
  agreement_signed BOOLEAN DEFAULT FALSE,
  payment_amount NUMERIC,
  amount_received NUMERIC,
  project_delivered BOOLEAN DEFAULT FALSE,
  region VARCHAR(20) NOT NULL DEFAULT 'Indian',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Then, add the region column if it doesn't exist
ALTER TABLE clients ADD COLUMN IF NOT EXISTS region VARCHAR(20) NOT NULL DEFAULT 'Indian';

-- 3. Optional: Update existing records to 'Indian' if needed
UPDATE clients SET region = 'Indian' WHERE region IS NULL OR region = '';

-- 4. Create/update the updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_clients_updated_at ON clients;
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 5. Enable RLS and create policies
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read access for authenticated users only" ON clients;
DROP POLICY IF EXISTS "Enable insert access for authenticated users only" ON clients;
DROP POLICY IF EXISTS "Enable update access for authenticated users only" ON clients;
DROP POLICY IF EXISTS "Enable delete access for authenticated users only" ON clients;

CREATE POLICY "Enable read access for authenticated users only" ON clients
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert access for authenticated users only" ON clients
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update access for authenticated users only" ON clients
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete access for authenticated users only" ON clients
  FOR DELETE USING (auth.role() = 'authenticated');

-- Verify everything
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'clients'
ORDER BY ordinal_position;

