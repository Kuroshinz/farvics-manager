const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envFile = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8');
const urlMatch = envFile.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = envFile.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/);

const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim(), {
  auth: { persistSession: false, autoRefreshToken: false }
});

const tables = [
  'users', 'workspaces', 'workspace_members', 'workspace_invitations',
  'user_sessions', 'user_security_logs', 'user_preferences',
  'financial_accounts', 'financial_categories', 'financial_journals',
  'financial_journal_entries', 'financial_budgets', 'financial_goals',
  'financial_exchange_rates', 'financial_reconciliation_records',
  'financial_recurring_transactions', 'projection_checkpoints',
  'projection_snapshots', 'idempotency_keys', 'outbox_events'
];

async function main() {
  for (const t of tables) {
    const { data, error } = await supabase.from(t).select('*').limit(1);
    if (error) {
      console.log(`[MISSING] ${t} - ${error.message}`);
    } else {
      console.log(`[EXISTS]  ${t} - rows: ${data.length}`);
    }
  }
}

main();
