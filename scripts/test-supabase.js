const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf8');
const urlMatch = envFile.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = envFile.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);

const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

async function testTables() {
  const tables = ['accounts', 'transactions', 'journals', 'budgets', 'goals', 'categories', 'exchange_rates', 'reports', 'reconciliation'];
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*').limit(1);
    if (error) {
      console.log(`[FAIL] Table: ${table} - ${error.message}`);
    } else {
      console.log(`[PASS] Table: ${table} - Records found: ${data.length}`);
    }
  }
}

testTables();
