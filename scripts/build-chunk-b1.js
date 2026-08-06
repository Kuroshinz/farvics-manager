const fs = require('fs');
const queriesPath = 'd:\\ManagerMn\\src\\app\\actions\\financial-queries.ts';

const queries = `
'use server';
import { createClient } from '../../shared/infrastructure/supabase/server';
import { cookies } from 'next/headers';

async function getActiveWorkspace() {
  const cookieStore = cookies();
  return cookieStore.get('active_workspace_id')?.value;
}

function applyWorkspaceFilter(query: any, workspaceId: string | undefined) {
  if (workspaceId) {
    return query.eq('workspace_id', workspaceId);
  }
  return query;
}

export async function fetchAccounts() {
  const supabase = createClient();
  const ws = await getActiveWorkspace();
  const { data, error } = await applyWorkspaceFilter(supabase.from('financial_accounts').select('*'), ws).order('created_at', { ascending: false }).limit(50);
  if (error || !data) return [];
  return data;
}

export async function fetchTransactions() {
  const supabase = createClient();
  const ws = await getActiveWorkspace();
  const { data, error } = await applyWorkspaceFilter(supabase.from('financial_journal_entries').select('*'), ws).limit(50);
  if (error || !data) return [];
  return data;
}

export async function fetchJournals() {
  const supabase = createClient();
  const ws = await getActiveWorkspace();
  const { data, error } = await applyWorkspaceFilter(supabase.from('financial_journals').select('*'), ws).order('created_at', { ascending: false }).limit(50);
  if (error || !data) return [];
  return data;
}

export async function fetchBudgets() {
  const supabase = createClient();
  const ws = await getActiveWorkspace();
  const { data, error } = await applyWorkspaceFilter(supabase.from('financial_budgets').select('*'), ws).order('created_at', { ascending: false }).limit(50);
  if (error || !data) return [];
  return data;
}

export async function fetchGoals() {
  const supabase = createClient();
  const ws = await getActiveWorkspace();
  const { data, error } = await applyWorkspaceFilter(supabase.from('financial_goals').select('*'), ws).order('created_at', { ascending: false }).limit(50);
  if (error || !data) return [];
  return data;
}

export async function fetchCategories() {
  const supabase = createClient();
  const ws = await getActiveWorkspace();
  const { data, error } = await applyWorkspaceFilter(supabase.from('financial_categories').select('*'), ws).order('name', { ascending: true }).limit(50);
  if (error || !data) return [];
  return data;
}

export async function fetchExchangeRates() {
  const supabase = createClient();
  const ws = await getActiveWorkspace();
  const { data, error } = await applyWorkspaceFilter(supabase.from('financial_exchange_rates').select('*'), ws).order('created_at', { ascending: false }).limit(50);
  if (error || !data) return [];
  return data;
}

export async function fetchReconciliation() {
  const supabase = createClient();
  const ws = await getActiveWorkspace();
  const { data, error } = await applyWorkspaceFilter(supabase.from('financial_reconciliation_records').select('*'), ws).order('created_at', { ascending: false }).limit(50);
  if (error || !data) return [];
  return data;
}

export async function getDashboardGatewayData() {
  const supabase = createClient();
  const ws = await getActiveWorkspace();
  
  const [accountsRes, txsRes] = await Promise.all([
    applyWorkspaceFilter(supabase.from('financial_accounts').select('balance'), ws),
    applyWorkspaceFilter(supabase.from('financial_journal_entries').select('amount, type'), ws)
  ]);

  let totalRevenue = 0;
  let totalExpenses = 0;
  
  if (!txsRes.error && txsRes.data) {
    txsRes.data.forEach((tx: any) => {
       if (tx.type === 'Income' || (tx.amount && tx.amount > 0)) totalRevenue += Number(tx.amount || 0);
       else totalExpenses += Math.abs(Number(tx.amount || 0));
    });
  }

  let liquidCapital = 0;
  if (!accountsRes.error && accountsRes.data) {
    accountsRes.data.forEach((acc: any) => {
      liquidCapital += Number(acc.balance || 0);
    });
  }

  const netProfit = totalRevenue - totalExpenses;

  return { insight: "Dữ liệu AI đang được tổng hợp dựa trên dòng tiền hiện tại...", metrics: {
      revenue: totalRevenue,
      expenses: totalExpenses,
      profit: netProfit,
      capital: liquidCapital
    }
  };
}
`;
fs.writeFileSync(queriesPath, queries);

