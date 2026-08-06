
'use server';
import { createClient } from '../../shared/infrastructure/supabase/server';
import { cookies } from 'next/headers';

async function getActiveWorkspace() {
  return cookies().get('active_workspace_id')?.value;
}

export async function generateReportData(type: string, dateRange: { from: string, to: string }) {
  const supabase = createClient();
  const ws = await getActiveWorkspace();
  
  let query = supabase.from('financial_journal_entries').select('id, amount, type, description, created_at, category:financial_categories(name)');
  if (ws) query = query.eq('workspace_id', ws);
  if (dateRange.from) query = query.gte('created_at', dateRange.from);
  if (dateRange.to) query = query.lte('created_at', dateRange.to);
  
  const { data, error } = await query;
  if (error || !data) return [];
  
  return data.map((d: any) => ({
    id: d.id,
    date: d.created_at,
    description: d.description,
    type: d.type,
    amount: d.amount,
    category: d.category?.name || 'N/A'
  }));
}
