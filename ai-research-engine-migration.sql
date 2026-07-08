-- AI Research Engine Migration
-- Add region column to clients if not exists
ALTER TABLE clients ADD COLUMN IF NOT EXISTS region TEXT DEFAULT 'Indian';

-- Create ai_analysis table
CREATE TABLE IF NOT EXISTS ai_analysis (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'Not Analyzed' CHECK (status IN ('Not Analyzed', 'Processing', 'Completed', 'Failed')),
  error_message TEXT,
  business_summary JSONB,
  digital_presence JSONB,
  website_status JSONB,
  public_online_presence JSONB,
  business_strengths JSONB,
  improvement_opportunities JSONB,
  suggested_services JSONB,
  confidence_score NUMERIC,
  raw_data JSONB,
  is_latest BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for client_id and is_latest
CREATE INDEX IF NOT EXISTS idx_ai_analysis_client_id ON ai_analysis(client_id);
CREATE INDEX IF NOT EXISTS idx_ai_analysis_latest ON ai_analysis(client_id, is_latest);

-- Add updated_at trigger for ai_analysis
DROP TRIGGER IF EXISTS update_ai_analysis_updated_at ON ai_analysis;
CREATE TRIGGER update_ai_analysis_updated_at BEFORE UPDATE ON ai_analysis
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS for ai_analysis
ALTER TABLE ai_analysis ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Enable read access for authenticated users only" ON ai_analysis;
DROP POLICY IF EXISTS "Enable insert access for authenticated users only" ON ai_analysis;
DROP POLICY IF EXISTS "Enable update access for authenticated users only" ON ai_analysis;
DROP POLICY IF EXISTS "Enable delete access for authenticated users only" ON ai_analysis;

-- Create policies
CREATE POLICY "Enable read access for authenticated users only" ON ai_analysis
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert access for authenticated users only" ON ai_analysis
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update access for authenticated users only" ON ai_analysis
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete access for authenticated users only" ON ai_analysis
  FOR DELETE USING (auth.role() = 'authenticated');
