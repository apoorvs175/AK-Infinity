-- AI Sales Coach & Memory System Migration
-- Add new tables for sales coaching and client memory

-- Table for storing AI Sales Coach reports
CREATE TABLE IF NOT EXISTS ai_sales_coach_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  ai_analysis_id UUID REFERENCES ai_analysis(id) ON DELETE CASCADE,
  opening_line TEXT,
  conversation_strategy JSONB,
  questions_to_ask JSONB,
  predicted_objections JSONB,
  professional_replies JSONB,
  closing_strategy TEXT,
  recommended_services JSONB,
  sales_tips JSONB,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for storing call notes
CREATE TABLE IF NOT EXISTS call_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  short_notes TEXT,
  ai_generated_summary JSONB,
  call_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for storing client timeline events
CREATE TABLE IF NOT EXISTS client_timeline (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL, -- e.g., CLIENT_ADDED, AI_ANALYSIS_COMPLETED, FIRST_CALL, FOLLOW_UP, etc.
  event_title TEXT,
  event_description TEXT,
  event_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for storing next follow-up recommendations
CREATE TABLE IF NOT EXISTS follow_up_recommendations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  recommended_action TEXT,
  priority VARCHAR(20), -- e.g., HIGH, MEDIUM, LOW
  due_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_completed BOOLEAN DEFAULT FALSE
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_ai_sales_coach_client ON ai_sales_coach_reports(client_id);
CREATE INDEX IF NOT EXISTS idx_call_notes_client ON call_notes(client_id);
CREATE INDEX IF NOT EXISTS idx_client_timeline_client ON client_timeline(client_id);
CREATE INDEX IF NOT EXISTS idx_follow_up_client ON follow_up_recommendations(client_id);

-- Add updated_at triggers
DROP TRIGGER IF EXISTS update_ai_sales_coach_updated_at ON ai_sales_coach_reports;
CREATE TRIGGER update_ai_sales_coach_updated_at BEFORE UPDATE ON ai_sales_coach_reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_call_notes_updated_at ON call_notes;
CREATE TRIGGER update_call_notes_updated_at BEFORE UPDATE ON call_notes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_follow_up_updated_at ON follow_up_recommendations;
CREATE TRIGGER update_follow_up_updated_at BEFORE UPDATE ON follow_up_recommendations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE ai_sales_coach_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE follow_up_recommendations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
DROP POLICY IF EXISTS "Enable read access for authenticated users only" ON ai_sales_coach_reports;
DROP POLICY IF EXISTS "Enable insert access for authenticated users only" ON ai_sales_coach_reports;
DROP POLICY IF EXISTS "Enable update access for authenticated users only" ON ai_sales_coach_reports;
DROP POLICY IF EXISTS "Enable delete access for authenticated users only" ON ai_sales_coach_reports;

CREATE POLICY "Enable read access for authenticated users only" ON ai_sales_coach_reports
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable insert access for authenticated users only" ON ai_sales_coach_reports
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update access for authenticated users only" ON ai_sales_coach_reports
  FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete access for authenticated users only" ON ai_sales_coach_reports
  FOR DELETE USING (auth.role() = 'authenticated');

-- Repeat policies for other tables
-- Call Notes
DROP POLICY IF EXISTS "Enable read access for authenticated users only" ON call_notes;
DROP POLICY IF EXISTS "Enable insert access for authenticated users only" ON call_notes;
DROP POLICY IF EXISTS "Enable update access for authenticated users only" ON call_notes;
DROP POLICY IF EXISTS "Enable delete access for authenticated users only" ON call_notes;

CREATE POLICY "Enable read access for authenticated users only" ON call_notes
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable insert access for authenticated users only" ON call_notes
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update access for authenticated users only" ON call_notes
  FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete access for authenticated users only" ON call_notes
  FOR DELETE USING (auth.role() = 'authenticated');

-- Client Timeline
DROP POLICY IF EXISTS "Enable read access for authenticated users only" ON client_timeline;
DROP POLICY IF EXISTS "Enable insert access for authenticated users only" ON client_timeline;
DROP POLICY IF EXISTS "Enable update access for authenticated users only" ON client_timeline;
DROP POLICY IF EXISTS "Enable delete access for authenticated users only" ON client_timeline;

CREATE POLICY "Enable read access for authenticated users only" ON client_timeline
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable insert access for authenticated users only" ON client_timeline
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update access for authenticated users only" ON client_timeline
  FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete access for authenticated users only" ON client_timeline
  FOR DELETE USING (auth.role() = 'authenticated');

-- Follow-up Recommendations
DROP POLICY IF EXISTS "Enable read access for authenticated users only" ON follow_up_recommendations;
DROP POLICY IF EXISTS "Enable insert access for authenticated users only" ON follow_up_recommendations;
DROP POLICY IF EXISTS "Enable update access for authenticated users only" ON follow_up_recommendations;
DROP POLICY IF EXISTS "Enable delete access for authenticated users only" ON follow_up_recommendations;

CREATE POLICY "Enable read access for authenticated users only" ON follow_up_recommendations
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable insert access for authenticated users only" ON follow_up_recommendations
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update access for authenticated users only" ON follow_up_recommendations
  FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete access for authenticated users only" ON follow_up_recommendations
  FOR DELETE USING (auth.role() = 'authenticated');
