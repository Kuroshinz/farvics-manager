'use server';

import { createClient } from '../../shared/infrastructure/supabase/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

function getWorkspaceId(cookieStore: any): string | null {
  return cookieStore.get('active_workspace_id')?.value ?? null;
}

export async function createTransaction(input: {
  date: string;
  account_id: string;
  category_id: string;
  amount: number;
  currency: string;
  description: string;
  reference?: string;
  status?: string;
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false as const, error: 'UNAUTHENTICATED' };

  const cookieStore = cookies();
  let workspaceId = cookieStore.get('active_workspace_id')?.value;
  
  if (!workspaceId) {
    const { data: ws } = await supabase.from('workspaces').select('id').eq('created_by', user.id).limit(1).single();
    if (ws) {
      workspaceId = ws.id;
    } else {
      const newWsId = crypto.randomUUID();
      await supabase.from('workspaces').insert({ id: newWsId, name: 'My Workspace', created_by: user.id, tenant_id: newWsId });
      await supabase.from('workspace_members').insert({ workspace_id: newWsId, user_id: user.id, role: 'owner', created_by: user.id, tenant_id: newWsId });
      workspaceId = newWsId;
    }
    cookieStore.set('active_workspace_id', workspaceId as string, { path: '/' });
  }
  if (!workspaceId) return { ok: false as const, error: 'WORKSPACE_REQUIRED' };

  const txId = crypto.randomUUID();
  const payload = {
    id: txId,
    date: input.date,
    description: input.description,
    reference: input.reference,
    status: input.status || 'Draft',
    workspace_id: workspaceId,
    tenant_id: workspaceId,
    created_by: user.id,
    updated_by: user.id
  };

  // We write to financial_journals to represent a simplified transaction for this UI
  const { data: journal, error: jError } = await supabase.from('financial_journals').insert(payload).select().single();
  if (jError) return { ok: false as const, error: jError.message };

  if (input.account_id && input.amount) {
    const entryPayload = {
      id: crypto.randomUUID(),
      journal_id: txId,
      account_id: input.account_id,
      amount: input.amount, // No more *100, we use direct VND
      type: input.amount >= 0 ? 'CREDIT' : 'DEBIT',
      description: input.description,
      workspace_id: workspaceId,
      tenant_id: workspaceId,
      created_by: user.id,
      updated_by: user.id
    };
    await supabase.from('financial_journal_entries').insert(entryPayload);
  }
  
  revalidatePath('/dashboard');
  revalidatePath('/transactions');
  return { ok: true as const, data: journal };
}

export async function updateTransaction(id: string, input: any) {
  const cookieStore = cookies();
  const workspaceId = getWorkspaceId(cookieStore);
  if (!workspaceId) return { ok: false as const, error: 'WORKSPACE_REQUIRED' };

  const supabase = createClient();
  const { data, error } = await supabase.from('financial_journals')
    .update(input)
    .eq('id', id)
    .eq('workspace_id', workspaceId)
    .select().single();

  if (error) return { ok: false as const, error: error.message };
  
  revalidatePath('/dashboard');
  revalidatePath('/transactions');
  return { ok: true as const, data };
}

export async function archiveTransaction(id: string) {
  const cookieStore = cookies();
  const workspaceId = getWorkspaceId(cookieStore);
  if (!workspaceId) return { ok: false as const, error: 'WORKSPACE_REQUIRED' };

  const supabase = createClient();
  const { error } = await supabase.from('financial_journals')
    .update({ status: 'Archived' })
    .eq('id', id)
    .eq('workspace_id', workspaceId);

  if (error) return { ok: false as const, error: error.message };
  
  revalidatePath('/dashboard');
  revalidatePath('/transactions');
  return { ok: true as const };
}

export async function restoreTransaction(id: string) {
  const cookieStore = cookies();
  const workspaceId = getWorkspaceId(cookieStore);
  if (!workspaceId) return { ok: false as const, error: 'WORKSPACE_REQUIRED' };

  const supabase = createClient();
  const { error } = await supabase.from('financial_journals')
    .update({ status: 'Draft' })
    .eq('id', id)
    .eq('workspace_id', workspaceId);

  if (error) return { ok: false as const, error: error.message };
  
  revalidatePath('/dashboard');
  revalidatePath('/transactions');
  return { ok: true as const };
}

export async function deleteTransaction(id: string) {
  const cookieStore = cookies();
  const workspaceId = getWorkspaceId(cookieStore);
  if (!workspaceId) return { ok: false as const, error: 'WORKSPACE_REQUIRED' };

  const supabase = createClient();
  const { error } = await supabase.from('financial_journals')
    .delete()
    .eq('id', id)
    .eq('workspace_id', workspaceId);

  if (error) return { ok: false as const, error: error.message };
  
  revalidatePath('/dashboard');
  revalidatePath('/transactions');
  return { ok: true as const };
}
