const fs = require('fs');
const content = `
'use server';
import { createClient } from '../../shared/infrastructure/supabase/server';

export async function fetchAccounts() {
  const supabase = createClient();
  const { data, error } = await supabase.from('financial_accounts').select('*').order('created_at', { ascending: false }).limit(50);
  if (error || !data) return [];
  return data;
}

export async function fetchTransactions() {
  const supabase = createClient();
  const { data, error } = await supabase.from('financial_journal_entries').select('*').limit(50);
  if (error || !data) return [];
  return data;
}

export async function fetchJournals() {
  const supabase = createClient();
  const { data, error } = await supabase.from('financial_journals').select('*').order('created_at', { ascending: false }).limit(50);
  if (error || !data) return [];
  return data;
}

export async function fetchBudgets() {
  const supabase = createClient();
  const { data, error } = await supabase.from('financial_budgets').select('*').order('created_at', { ascending: false }).limit(50);
  if (error || !data) return [];
  return data;
}

export async function fetchGoals() {
  const supabase = createClient();
  const { data, error } = await supabase.from('financial_goals').select('*').order('created_at', { ascending: false }).limit(50);
  if (error || !data) return [];
  return data;
}

export async function fetchCategories() {
  const supabase = createClient();
  const { data, error } = await supabase.from('financial_categories').select('*').order('name', { ascending: true }).limit(50);
  if (error || !data) return [];
  return data;
}

export async function fetchExchangeRates() {
  const supabase = createClient();
  const { data, error } = await supabase.from('financial_exchange_rates').select('*').order('created_at', { ascending: false }).limit(50);
  if (error || !data) return [];
  return data;
}

export async function fetchReports() {
  return [];
}

export async function fetchReconciliation() {
  const supabase = createClient();
  const { data, error } = await supabase.from('financial_reconciliation_records').select('*').order('created_at', { ascending: false }).limit(50);
  if (error || !data) return [];
  return data;
}

export async function getDashboardGatewayData() {
  const supabase = createClient();
  
  const [accountsRes, txsRes] = await Promise.all([
    supabase.from('financial_accounts').select('balance'),
    supabase.from('financial_journal_entries').select('amount, type')
  ]);

  let totalRevenue = 0;
  let totalExpenses = 0;
  
  if (!txsRes.error && txsRes.data) {
    txsRes.data.forEach(tx => {
       if (tx.type === 'Income' || (tx.amount && tx.amount > 0)) totalRevenue += Number(tx.amount || 0);
       else totalExpenses += Math.abs(Number(tx.amount || 0));
    });
  }

  let liquidCapital = 0;
  if (!accountsRes.error && accountsRes.data) {
    accountsRes.data.forEach(acc => {
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
fs.writeFileSync('d:\\ManagerMn\\src\\app\\actions\\financial-queries.ts', content.trim(), 'utf8');
