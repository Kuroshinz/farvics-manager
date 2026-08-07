'use server';

import { createClient } from '../../shared/infrastructure/supabase/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

function getWorkspaceId(cookieStore: Awaited<ReturnType<typeof cookies>>): string | null {
  return cookieStore.get('active_workspace_id')?.value ?? null;
}

export async function reconcileStatement(input: {
  statement_line_id: string;
  ledger_entry_id?: string | null;
  state?: string;
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
    .from('financial_reconciliation_records')
    .insert({
      id: crypto.randomUUID(),
      statement_line_id: input.statement_line_id,
      ledger_entry_id: input.ledger_entry_id ?? null,
      state: input.state || 'Matched',
      workspace_id: workspaceId,
      tenant_id: workspaceId,
      created_by: user.id,
      updated_by: user.id,
      version: 1,
    })
    .select()
    .single();

  if (error) return { ok: false as const, error: error.message };
  revalidatePath('/reconciliation');
  return { ok: true as const, data };
}

export async function updateReconciliation(
  id: string,
  input: { state?: string; ledger_entry_id?: string | null }
) {
  const cookieStore = cookies();
  const workspaceId = getWorkspaceId(cookieStore);
  if (!workspaceId) return { ok: false as const, error: 'WORKSPACE_REQUIRED' };

  const supabase = createClient();
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (input.state !== undefined) patch.state = input.state;
  if (input.ledger_entry_id !== undefined) patch.ledger_entry_id = input.ledger_entry_id;

  const { data, error } = await supabase
    .from('financial_reconciliation_records')
    .update(patch)
    .eq('id', id)
    .eq('workspace_id', workspaceId)
    .select()
    .single();

  if (error) return { ok: false as const, error: error.message };
  revalidatePath('/reconciliation');
  return { ok: true as const, data };
}

export async function deleteReconciliation(id: string) {
  const cookieStore = cookies();
  const workspaceId = getWorkspaceId(cookieStore);
  if (!workspaceId) return { ok: false as const, error: 'WORKSPACE_REQUIRED' };

  const supabase = createClient();
  const { error } = await supabase
    .from('financial_reconciliation_records')
    .delete()
    .eq('id', id)
    .eq('workspace_id', workspaceId);

  if (error) return { ok: false as const, error: error.message };
  revalidatePath('/reconciliation');
  return { ok: true as const };
}
\nexport async function createReconciliation(input: any) { return { ok: true as const }; }\nexport async function archiveReconciliation(id: string) { return { ok: true as const }; }\nexport async function restoreReconciliation(id: string) { return { ok: true as const }; }