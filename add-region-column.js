
// This script will add the 'region' column to your clients table
// You can run this script, or execute the SQL manually in your database

console.log('🔧 Adding region column to clients table...');

const SQL = `
ALTER TABLE clients 
ADD COLUMN IF NOT EXISTS region VARCHAR(20) NOT NULL DEFAULT 'Indian';

-- Optional: Update existing records to 'Indian'
-- UPDATE clients SET region = 'Indian' WHERE region IS NULL;

-- Verify the column was added
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'clients' AND column_name = 'region';
`;

console.log('📄 SQL to execute:');
console.log(SQL);
console.log('\n✅ Done! Execute this SQL in your database.');
console.log('\n⚠️ Important:');
console.log('1. If you are using Supabase, go to the SQL Editor and paste this');
console.log('2. If you are using PostgreSQL, run this with psql or pgAdmin');
console.log('3. This will set existing clients to "Indian" by default');

