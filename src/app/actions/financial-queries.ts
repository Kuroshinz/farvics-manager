'use server';
import { createClient } from '../../shared/infrastructure/supabase/server';

export async function fetchAccounts() {
  const supabase = createClient();
  const { data, error } = await supabase.from('accounts').select('*').order('created_at', { ascending: false }).limit(50);
  if (error || !data) return [];
  return data;
}

export async function fetchTransactions() {
  const supabase = createClient();
  const { data, error } = await supabase.from('transactions').select('*').order('date', { ascending: false }).limit(50);
  if (error || !data) return [];
  return data;
}

export async function fetchJournals() {
  const supabase = createClient();
  const { data, error } = await supabase.from('journals').select('*').order('date', { ascending: false }).limit(50);
  if (error || !data) return [];
  return data;
}

export async function fetchBudgets() {
  const supabase = createClient();
  const { data, error } = await supabase.from('budgets').select('*').order('created_at', { ascending: false }).limit(50);
  if (error || !data) return [];
  return data;
}

export async function fetchGoals() {
  const supabase = createClient();
  const { data, error } = await supabase.from('goals').select('*').order('created_at', { ascending: false }).limit(50);
  if (error || !data) return [];
  return data;
}

export async function fetchCategories() {
  const supabase = createClient();
  const { data, error } = await supabase.from('categories').select('*').order('name', { ascending: true }).limit(50);
  if (error || !data) return [];
  return data;
}

export async function fetchExchangeRates() {
  const supabase = createClient();
  const { data, error } = await supabase.from('exchange_rates').select('*').order('last_updated', { ascending: false }).limit(50);
  if (error || !data) return [];
  return data;
}

export async function fetchReports() {
  const supabase = createClient();
  const { data, error } = await supabase.from('reports').select('*').order('generated', { ascending: false }).limit(50);
  if (error || !data) return [];
  return data;
}

export async function fetchReconciliation() {
  const supabase = createClient();
  const { data, error } = await supabase.from('reconciliation').select('*').order('statement_date', { ascending: false }).limit(50);
  if (error || !data) return [];
  return data;
}

export async function getDashboardGatewayData() {
  const supabase = createClient();
  
  // Aggregate real metrics from Supabase
  const [accountsRes, txsRes] = await Promise.all([
    supabase.from('accounts').select('balance'),
    supabase.from('transactions').select('amount, type')
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


