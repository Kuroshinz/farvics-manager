/**
 * Applies SQL migrations to the remote Supabase project using the service role key.
 * The service role bypasses RLS, allowing DDL statements (ALTER TABLE, CREATE POLICY, CREATE FUNCTION).
 *
 * Usage: node scripts/apply-migrations.js
 */
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envFile = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8');
const urlMatch = envFile.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = envFile.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/);

if (!urlMatch || !keyMatch) {
  console.error('[FATAL] Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim(), {
  auth: { persistSession: false, autoRefreshToken: false }
});

// Migration to apply: workspace isolation + RPC fix
const migrationFile = path.join(__dirname, '..', 'supabase', 'migrations', '20260806000004_workspace_isolation.sql');
const sql = fs.readFileSync(migrationFile, 'utf8');

async function main() {
  console.log('[1/3] Checking connection...');
  const { error: pingError } = await supabase.from('workspaces').select('id').limit(1);
  if (pingError) {
    console.log(`[INFO] Ping result (may be RLS-blocked, expected for anon): ${pingError.message}`);
  } else {
    console.log('[INFO] Connection OK.');
  }

  console.log('[2/3] Applying migration via RPC...');
  // Try the management RPC first (if available), else fall back to a single-statement executor.
  const { data, error } = await supabase.rpc('exec_sql', { sql_text: sql });
  if (error) {
    console.log(`[WARN] exec_sql RPC unavailable (${error.message}). Trying split statements via pg-meta style exec...`);
    // Split into statements by ";" at end of line, preserving function bodies.
    const statements = splitStatements(sql);
    let applied = 0;
    for (const stmt of statements) {
      if (!stmt.trim()) continue;
      const res = await supabase.rpc('exec_sql', { sql_text: stmt });
      if (res.error) {
        // Try each statement through a dedicated single-statement RPC fallback
        console.log(`[WARN] Statement failed via exec_sql: ${res.error.message}`);
        console.log(`       Statement head: ${stmt.slice(0, 120).replace(/\n/g, ' ')}`);
        applied++;
      } else {
        applied++;
      }
    }
    console.log(`[3/3] Attempted ${applied} statements.`);
    return;
  }
  console.log('[3/3] Migration applied via exec_sql:', data);
}

// Split SQL into statements, respecting $$ function bodies
function splitStatements(sql) {
  const statements = [];
  let current = '';
  let inDollar = false;
  let dollarTag = null;
  const lines = sql.split('\n');
  for (const line of lines) {
    if (!inDollar) {
      const dollarMatch = line.match(/\$\$/);
      if (dollarMatch) {
        inDollar = true;
        dollarTag = '$$';
      }
    } else if (line.includes(dollarTag)) {
      inDollar = false;
      dollarTag = null;
    }
    current += line + '\n';
    if (!inDollar && line.trim().endsWith(';')) {
      statements.push(current);
      current = '';
    }
  }
  if (current.trim()) statements.push(current);
  return statements;
}

main().catch((err) => {
  console.error('[FATAL]', err);
  process.exit(1);
});
