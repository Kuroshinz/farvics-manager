'use server';

import { createClient } from '../../shared/infrastructure/supabase/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

function getWorkspaceId(cookieStore: Awaited<ReturnType<typeof cookies>>): string | null {
  return cookieStore.get('active_workspace_id')?.value ?? null;
}

export async function createAccount(input: {
  name: string;
  currency_code: string;
  status?: string;
  balance?: number;
}) {
  const cookieStore = cookies();
  const workspaceId = getWorkspaceId(cookieStore);
  if (!workspaceId) return { ok: false as const, error: 'WORKSPACE_REQUIRED' };

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false as const, error: 'UNAUTHENTICATED' };

  const { data, error } = await supabase
    .from('financial_accounts')
    .insert({
      id: crypto.randomUUID(),
      name: input.name,
      currency_code: input.currency_code || 'VND',
      status: input.status || 'Active',
      balance: Math.round((input.balance ?? 0) * 100),
      workspace_id: workspaceId,
      tenant_id: workspaceId,
      created_by: user.id,
      updated_by: user.id,
      version: 1,
    })
    .select()
    .single();

  if (error) return { ok: false as const, error: error.message };
  revalidatePath('/accounts');
  return { ok: true as const, data };
}

export async function updateAccount(
  id: string,
  input: { name?: string; status?: string; balance?: number; currency_code?: string }
) {
  const cookieStore = cookies();
  const workspaceId = getWorkspaceId(cookieStore);
  if (!workspaceId) return { ok: false as const, error: 'WORKSPACE_REQUIRED' };

  const supabase = createClient();
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (input.name !== undefined) patch.name = input.name;
  if (input.status !== undefined) patch.status = input.status;
  if (input.currency_code !== undefined) patch.currency_code = input.currency_code;
  if (input.balance !== undefined) patch.balance = Math.round(input.balance * 100);

  const { data, error } = await supabase
    .from('financial_accounts')
    .update(patch)
    .eq('id', id)
    .eq('workspace_id', workspaceId)
    .select()
    .single();

  if (error) return { ok: false as const, error: error.message };
  revalidatePath('/accounts');
  return { ok: true as const, data };
}

export async function archiveAccount(id: string) {
  const cookieStore = cookies();
  const workspaceId = getWorkspaceId(cookieStore);
  if (!workspaceId) return { ok: false as const, error: 'WORKSPACE_REQUIRED' };

  const supabase = createClient();
  const { error } = await supabase
    .from('financial_accounts')
    .update({ deleted_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('workspace_id', workspaceId);

  if (error) return { ok: false as const, error: error.message };
  revalidatePath('/accounts');
  return { ok: true as const };
}

export async function restoreAccount(id: string) {
  const cookieStore = cookies();
  const workspaceId = getWorkspaceId(cookieStore);
  if (!workspaceId) return { ok: false as const, error: 'WORKSPACE_REQUIRED' };

  const supabase = createClient();
  const { error } = await supabase
    .from('financial_accounts')
    .update({ deleted_at: null, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('workspace_id', workspaceId);

  if (error) return { ok: false as const, error: error.message };
  revalidatePath('/accounts');
  return { ok: true as const };
}

export async function deleteAccount(id: string) {
  const cookieStore = cookies();
  const workspaceId = getWorkspaceId(cookieStore);
  if (!workspaceId) return { ok: false as const, error: 'WORKSPACE_REQUIRED' };

  const supabase = createClient();
  const { error } = await supabase
    .from('financial_accounts')
    .delete()
    .eq('id', id)
    .eq('workspace_id', workspaceId);

  if (error) return { ok: false as const, error: error.message };
  revalidatePath('/accounts');
  return { ok: true as const };
}
