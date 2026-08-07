'use server';

import { createClient } from '../../shared/infrastructure/supabase/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

function getWorkspaceId(cookieStore: Awaited<ReturnType<typeof cookies>>): string | null {
  return cookieStore.get('active_workspace_id')?.value ?? null;
}

export async function createCategory(input: { name: string; parent_id?: string | null }) {
  const cookieStore = cookies();
  const workspaceId = getWorkspaceId(cookieStore);
  if (!workspaceId) return { ok: false as const, error: 'WORKSPACE_REQUIRED' };

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false as const, error: 'UNAUTHENTICATED' };

  const { data, error } = await supabase
    .from('financial_categories')
    .insert({
      id: crypto.randomUUID(),
      name: input.name,
      parent_id: input.parent_id ?? null,
      workspace_id: workspaceId,
      tenant_id: workspaceId,
      created_by: user.id,
      updated_by: user.id,
      version: 1,
    })
    .select()
    .single();

  if (error) return { ok: false as const, error: error.message };
  revalidatePath('/categories');
  return { ok: true as const, data };
}

export async function updateCategory(id: string, input: { name?: string; parent_id?: string | null }) {
  const cookieStore = cookies();
  const workspaceId = getWorkspaceId(cookieStore);
  if (!workspaceId) return { ok: false as const, error: 'WORKSPACE_REQUIRED' };

  const supabase = createClient();
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (input.name !== undefined) patch.name = input.name;
  if (input.parent_id !== undefined) patch.parent_id = input.parent_id;

  const { data, error } = await supabase
    .from('financial_categories')
    .update(patch)
    .eq('id', id)
    .eq('workspace_id', workspaceId)
    .select()
    .single();

  if (error) return { ok: false as const, error: error.message };
  revalidatePath('/categories');
  return { ok: true as const, data };
}

export async function archiveCategory(id: string) {
  const cookieStore = cookies();
  const workspaceId = getWorkspaceId(cookieStore);
  if (!workspaceId) return { ok: false as const, error: 'WORKSPACE_REQUIRED' };

  const supabase = createClient();
  const { error } = await supabase
    .from('financial_categories')
    .update({ deleted_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('workspace_id', workspaceId);

  if (error) return { ok: false as const, error: error.message };
  revalidatePath('/categories');
  return { ok: true as const };
}

export async function restoreCategory(id: string) {
  const cookieStore = cookies();
  const workspaceId = getWorkspaceId(cookieStore);
  if (!workspaceId) return { ok: false as const, error: 'WORKSPACE_REQUIRED' };

  const supabase = createClient();
  const { error } = await supabase
    .from('financial_categories')
    .update({ deleted_at: null, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('workspace_id', workspaceId);

  if (error) return { ok: false as const, error: error.message };
  revalidatePath('/categories');
  return { ok: true as const };
}

export async function deleteCategory(id: string) {
  const cookieStore = cookies();
  const workspaceId = getWorkspaceId(cookieStore);
  if (!workspaceId) return { ok: false as const, error: 'WORKSPACE_REQUIRED' };

  const supabase = createClient();
  const { error } = await supabase
    .from('financial_categories')
    .delete()
    .eq('id', id)
    .eq('workspace_id', workspaceId);

  if (error) return { ok: false as const, error: error.message };
  revalidatePath('/categories');
  return { ok: true as const };
}
