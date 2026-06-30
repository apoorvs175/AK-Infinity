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

-- ============================================
-- ADMIN SESSIONS TABLE
-- ============================================
DROP TABLE IF EXISTS admin_sessions CASCADE;
CREATE TABLE admin_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  user_agent TEXT,
  ip_address TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for session_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_admin_sessions_session_id ON admin_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_email ON admin_sessions(email);

-- Create trigger for admin_sessions
DROP TRIGGER IF EXISTS update_admin_sessions_updated_at ON admin_sessions;
CREATE TRIGGER update_admin_sessions_updated_at BEFORE UPDATE ON admin_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- CLIENTS TABLE
-- ============================================
DROP TABLE IF EXISTS clients CASCADE;
CREATE TABLE clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_name TEXT NOT NULL,
  owner_name TEXT,
  owner_contact_number TEXT,
  address_name TEXT,
  google_maps_link TEXT,
  first_call BOOLEAN DEFAULT false,
  first_meeting BOOLEAN DEFAULT false,
  agreement_signed BOOLEAN DEFAULT false,
  payment_amount DECIMAL(12, 2) DEFAULT 0,
  amount_received DECIMAL(12, 2) DEFAULT 0,
  project_delivered BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for clients
CREATE INDEX IF NOT EXISTS idx_clients_business_name ON clients(business_name);
CREATE INDEX IF NOT EXISTS idx_clients_created_at ON clients(created_at DESC);

-- Create trigger for clients
DROP TRIGGER IF EXISTS update_clients_updated_at ON clients;
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Admin Sessions Policies
DROP POLICY IF EXISTS "Enable read sessions" ON admin_sessions;
DROP POLICY IF EXISTS "Enable insert sessions" ON admin_sessions;
DROP POLICY IF EXISTS "Enable update sessions" ON admin_sessions;
DROP POLICY IF EXISTS "Enable delete sessions" ON admin_sessions;

CREATE POLICY "Enable read sessions" ON admin_sessions
  FOR SELECT USING (true);

CREATE POLICY "Enable insert sessions" ON admin_sessions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update sessions" ON admin_sessions
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete sessions" ON admin_sessions
  FOR DELETE USING (true);

-- Clients Policies
DROP POLICY IF EXISTS "Enable read clients" ON clients;
DROP POLICY IF EXISTS "Enable insert clients" ON clients;
DROP POLICY IF EXISTS "Enable update clients" ON clients;
DROP POLICY IF EXISTS "Enable delete clients" ON clients;

CREATE POLICY "Enable read clients" ON clients
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert clients" ON clients
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update clients" ON clients
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete clients" ON clients
  FOR DELETE USING (auth.role() = 'authenticated');
