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
  const { data, error } = await applyWorkspaceFilter(supabase.from('financial_accounts').select('*'), ws)
    .order('created_at', { ascending: false })
    .limit(50);
  if (error || !data) return [];
  return data;
}

export async function fetchTransactions() {
  const supabase = createClient();
  const ws = await getActiveWorkspace();
  const { data, error } = await applyWorkspaceFilter(
    supabase.from('financial_journal_entries').select('*'),
    ws
  )
    .order('created_at', { ascending: false })
    .limit(50);
  if (error || !data) return [];
  return data;
}

export async function fetchJournals() {
  const supabase = createClient();
  const ws = await getActiveWorkspace();
  const { data, error } = await applyWorkspaceFilter(supabase.from('financial_journals').select('*'), ws)
    .order('created_at', { ascending: false })
    .limit(50);
  if (error || !data) return [];
  return data;
}

export async function fetchBudgets() {
  const supabase = createClient();
  const ws = await getActiveWorkspace();
  const { data, error } = await applyWorkspaceFilter(supabase.from('financial_budgets').select('*'), ws)
    .order('created_at', { ascending: false })
    .limit(50);
  if (error || !data) return [];
  return data;
}

export async function fetchGoals() {
  const supabase = createClient();
  const ws = await getActiveWorkspace();
  const { data, error } = await applyWorkspaceFilter(supabase.from('financial_goals').select('*'), ws)
    .order('created_at', { ascending: false })
    .limit(50);
  if (error || !data) return [];
  return data;
}

export async function fetchCategories() {
  const supabase = createClient();
  const ws = await getActiveWorkspace();
  const { data, error } = await applyWorkspaceFilter(supabase.from('financial_categories').select('*'), ws)
    .order('name', { ascending: true })
    .limit(50);
  if (error || !data) return [];
  return data;
}

export async function fetchExchangeRates() {
  const supabase = createClient();
  const ws = await getActiveWorkspace();
  const { data, error } = await applyWorkspaceFilter(supabase.from('financial_exchange_rates').select('*'), ws)
    .order('created_at', { ascending: false })
    .limit(50);
  if (error || !data) return [];
  return data;
}

export async function fetchReconciliation() {
  const supabase = createClient();
  const ws = await getActiveWorkspace();
  const { data, error } = await applyWorkspaceFilter(supabase.from('financial_reconciliation_records').select('*'), ws)
    .order('created_at', { ascending: false })
    .limit(50);
  if (error || !data) return [];
  return data;
}

export async function getDashboardGatewayData() {
  const supabase = createClient();
  const ws = await getActiveWorkspace();

  const [accountsRes, txsRes] = await Promise.all([
    applyWorkspaceFilter(supabase.from('financial_accounts').select('id, currency_code'), ws),
    applyWorkspaceFilter(supabase.from('financial_journal_entries').select('amount_minor_units, entry_type'), ws)
  ]);

  let totalRevenue = 0;
  let totalExpenses = 0;

  if (!txsRes.error && txsRes.data) {
    txsRes.data.forEach((tx: any) => {
      const amount = Number(tx.amount_minor_units || 0) / 100;
      if (tx.entry_type === 'CREDIT') totalRevenue += amount;
      else totalExpenses += Math.abs(amount);
    });
  }

  let liquidCapital = 0;
  if (!accountsRes.error && accountsRes.data) {
    // Account balances are derived from journal entries; count account count as capital proxy
    liquidCapital = accountsRes.data.length;
  }

  const netProfit = totalRevenue - totalExpenses;

  return {
    insight: 'Dữ liệu AI đang được tổng hợp dựa trên dòng tiền hiện tại của bạn. Những gợi ý thông minh sẽ xuất hiện ngay khi có đủ dữ liệu giao dịch.',
    metrics: {
      revenue: totalRevenue,
      expenses: totalExpenses,
      profit: netProfit,
      capital: liquidCapital
    }
  };
}
