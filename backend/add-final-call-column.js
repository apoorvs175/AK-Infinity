import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  // Run the ALTER TABLE via SQL (using supabase.rpc or direct query)
  // Since Supabase allows direct SQL via the admin API or using the client with service role
  console.log('Adding final_call column to clients table...');
  
  // We'll use a function approach or just run via SQL editor, but let's log the exact SQL
  console.log('Please run this SQL in your Supabase SQL Editor:');
  console.log('ALTER TABLE clients ADD COLUMN IF NOT EXISTS final_call BOOLEAN DEFAULT FALSE;');
  
  // Alternatively, if using Supabase's SQL execution:
  // const { data, error } = await supabase.rpc('exec_sql', { sql: '...' });
} else {
  console.error('SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set');
}
