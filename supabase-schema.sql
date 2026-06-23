-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create visitors table
CREATE TABLE IF NOT EXISTS visitors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address TEXT,
  user_agent TEXT,
  device_type TEXT,
  browser TEXT,
  os TEXT,
  page_visited TEXT,
  referrer TEXT,
  time_spent INTEGER DEFAULT 0,
  session_id TEXT,
  latitude DECIMAL,
  longitude DECIMAL,
  accuracy DECIMAL,
  full_address TEXT,
  locality TEXT,
  city TEXT,
  district TEXT,
  state TEXT,
  country TEXT,
  postal_code TEXT,
  location_permission TEXT DEFAULT 'not_requested',
  google_maps_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add location columns if they don't exist (for existing tables)
ALTER TABLE visitors ADD COLUMN IF NOT EXISTS latitude DECIMAL;
ALTER TABLE visitors ADD COLUMN IF NOT EXISTS longitude DECIMAL;
ALTER TABLE visitors ADD COLUMN IF NOT EXISTS accuracy DECIMAL;
ALTER TABLE visitors ADD COLUMN IF NOT EXISTS full_address TEXT;
ALTER TABLE visitors ADD COLUMN IF NOT EXISTS locality TEXT;
ALTER TABLE visitors ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE visitors ADD COLUMN IF NOT EXISTS district TEXT;
ALTER TABLE visitors ADD COLUMN IF NOT EXISTS state TEXT;
ALTER TABLE visitors ADD COLUMN IF NOT EXISTS country TEXT;
ALTER TABLE visitors ADD COLUMN IF NOT EXISTS postal_code TEXT;
ALTER TABLE visitors ADD COLUMN IF NOT EXISTS location_permission TEXT DEFAULT 'not_requested';
ALTER TABLE visitors ADD COLUMN IF NOT EXISTS google_maps_url TEXT;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop triggers if they exist
DROP TRIGGER IF EXISTS update_leads_updated_at ON leads;
DROP TRIGGER IF EXISTS update_visitors_updated_at ON visitors;

-- Create triggers
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_visitors_updated_at BEFORE UPDATE ON visitors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS (safe to run multiple times)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;

-- Drop existing policies first to avoid conflicts
DROP POLICY IF EXISTS "Enable read access for authenticated users only" ON leads;
DROP POLICY IF EXISTS "Enable insert access for all users" ON leads;
DROP POLICY IF EXISTS "Enable update access for authenticated users only" ON leads;
DROP POLICY IF EXISTS "Enable delete access for authenticated users only" ON leads;

-- Create policies
CREATE POLICY "Enable read access for authenticated users only" ON leads
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert access for all users" ON leads
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users only" ON leads
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete access for authenticated users only" ON leads
  FOR DELETE USING (auth.role() = 'authenticated');

-- Drop existing visitor policies
DROP POLICY IF EXISTS "Enable read access for authenticated users only" ON visitors;
DROP POLICY IF EXISTS "Enable insert access for all users" ON visitors;
DROP POLICY IF EXISTS "Enable update access for authenticated users only" ON visitors;

-- Create visitor policies
CREATE POLICY "Enable read access for authenticated users only" ON visitors
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert access for all users" ON visitors
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users only" ON visitors
  FOR UPDATE USING (auth.role() = 'authenticated');
