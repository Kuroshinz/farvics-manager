'use server';

import { createClient } from '../../shared/infrastructure/supabase/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

function getWorkspaceId(cookieStore: Awaited<ReturnType<typeof cookies>>): string | null {
  return cookieStore.get('active_workspace_id')?.value ?? null;
}

export async function createGoal(input: {
  name: string;
  target_minor_units: number;
  currency_code?: string;
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
    .from('financial_goals')
    .insert({
      id: crypto.randomUUID(),
      name: input.name,
      target_minor_units: input.target_minor_units,
      currency_code: input.currency_code || 'VND',
      workspace_id: workspaceId,
      tenant_id: workspaceId,
      created_by: user.id,
      updated_by: user.id,
      version: 1,
    })
    .select()
    .single();

  if (error) return { ok: false as const, error: error.message };
  revalidatePath('/goals');
  return { ok: true as const, data };
}

export async function updateGoal(
  id: string,
  input: { name?: string; target_minor_units?: number; currency_code?: string }
) {
  const cookieStore = cookies();
  const workspaceId = getWorkspaceId(cookieStore);
  if (!workspaceId) return { ok: false as const, error: 'WORKSPACE_REQUIRED' };

  const supabase = createClient();
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (input.name !== undefined) patch.name = input.name;
  if (input.target_minor_units !== undefined) patch.target_minor_units = input.target_minor_units;
  if (input.currency_code !== undefined) patch.currency_code = input.currency_code;

  const { data, error } = await supabase
    .from('financial_goals')
    .update(patch)
    .eq('id', id)
    .eq('workspace_id', workspaceId)
    .select()
    .single();

  if (error) return { ok: false as const, error: error.message };
  revalidatePath('/goals');
  return { ok: true as const, data };
}

export async function archiveGoal(id: string) {
  const cookieStore = cookies();
  const workspaceId = getWorkspaceId(cookieStore);
  if (!workspaceId) return { ok: false as const, error: 'WORKSPACE_REQUIRED' };

  const supabase = createClient();
  const { error } = await supabase
    .from('financial_goals')
    .update({ deleted_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('workspace_id', workspaceId);

  if (error) return { ok: false as const, error: error.message };
  revalidatePath('/goals');
  return { ok: true as const };
}

export async function restoreGoal(id: string) {
  const cookieStore = cookies();
  const workspaceId = getWorkspaceId(cookieStore);
  if (!workspaceId) return { ok: false as const, error: 'WORKSPACE_REQUIRED' };

  const supabase = createClient();
  const { error } = await supabase
    .from('financial_goals')
    .update({ deleted_at: null, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('workspace_id', workspaceId);

  if (error) return { ok: false as const, error: error.message };
  revalidatePath('/goals');
  return { ok: true as const };
}

export async function deleteGoal(id: string) {
  const cookieStore = cookies();
  const workspaceId = getWorkspaceId(cookieStore);
  if (!workspaceId) return { ok: false as const, error: 'WORKSPACE_REQUIRED' };

  const supabase = createClient();
  const { error } = await supabase
    .from('financial_goals')
    .delete()
    .eq('id', id)
    .eq('workspace_id', workspaceId);

  if (error) return { ok: false as const, error: error.message };
  revalidatePath('/goals');
  return { ok: true as const };
}
