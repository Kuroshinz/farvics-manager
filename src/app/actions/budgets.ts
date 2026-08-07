'use server';

import { createClient } from '../../shared/infrastructure/supabase/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

function getWorkspaceId(cookieStore: Awaited<ReturnType<typeof cookies>>): string | null {
  return cookieStore.get('active_workspace_id')?.value ?? null;
}

export async function createBudget(input: {
  name: string;
  limit_minor_units: number;
  currency_code?: string;
  period_start?: string;
  period_end?: string;
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
    .from('financial_budgets')
    .insert({
      id: crypto.randomUUID(),
      name: input.name,
      limit_minor_units: input.limit_minor_units,
      currency_code: input.currency_code || 'VND',
      period_start: input.period_start || new Date().toISOString().slice(0, 10),
      period_end: input.period_end || new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().slice(0, 10),
      workspace_id: workspaceId,
      tenant_id: workspaceId,
      created_by: user.id,
      updated_by: user.id,
      version: 1,
    })
    .select()
    .single();

  if (error) return { ok: false as const, error: error.message };
  revalidatePath('/budgets');
  return { ok: true as const, data };
}

export async function updateBudget(
  id: string,
  input: { name?: string; limit_minor_units?: number; currency_code?: string; period_start?: string; period_end?: string }
) {
  const cookieStore = cookies();
  const workspaceId = getWorkspaceId(cookieStore);
  if (!workspaceId) return { ok: false as const, error: 'WORKSPACE_REQUIRED' };

  const supabase = createClient();
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (input.name !== undefined) patch.name = input.name;
  if (input.limit_minor_units !== undefined) patch.limit_minor_units = input.limit_minor_units;
  if (input.currency_code !== undefined) patch.currency_code = input.currency_code;
  if (input.period_start !== undefined) patch.period_start = input.period_start;
  if (input.period_end !== undefined) patch.period_end = input.period_end;

  const { data, error } = await supabase
    .from('financial_budgets')
    .update(patch)
    .eq('id', id)
    .eq('workspace_id', workspaceId)
    .select()
    .single();

  if (error) return { ok: false as const, error: error.message };
  revalidatePath('/budgets');
  return { ok: true as const, data };
}

export async function archiveBudget(id: string) {
  const cookieStore = cookies();
  const workspaceId = getWorkspaceId(cookieStore);
  if (!workspaceId) return { ok: false as const, error: 'WORKSPACE_REQUIRED' };

  const supabase = createClient();
  const { error } = await supabase
    .from('financial_budgets')
    .update({ deleted_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('workspace_id', workspaceId);

  if (error) return { ok: false as const, error: error.message };
  revalidatePath('/budgets');
  return { ok: true as const };
}

export async function restoreBudget(id: string) {
  const cookieStore = cookies();
  const workspaceId = getWorkspaceId(cookieStore);
  if (!workspaceId) return { ok: false as const, error: 'WORKSPACE_REQUIRED' };

  const supabase = createClient();
  const { error } = await supabase
    .from('financial_budgets')
    .update({ deleted_at: null, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('workspace_id', workspaceId);

  if (error) return { ok: false as const, error: error.message };
  revalidatePath('/budgets');
  return { ok: true as const };
}

export async function deleteBudget(id: string) {
  const cookieStore = cookies();
  const workspaceId = getWorkspaceId(cookieStore);
  if (!workspaceId) return { ok: false as const, error: 'WORKSPACE_REQUIRED' };

  const supabase = createClient();
  const { error } = await supabase
    .from('financial_budgets')
    .delete()
    .eq('id', id)
    .eq('workspace_id', workspaceId);

  if (error) return { ok: false as const, error: error.message };
  revalidatePath('/budgets');
  return { ok: true as const };
}
