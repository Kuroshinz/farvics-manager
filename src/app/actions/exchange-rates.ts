'use server';

import { createClient } from '../../shared/infrastructure/supabase/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

function getWorkspaceId(cookieStore: Awaited<ReturnType<typeof cookies>>): string | null {
  return cookieStore.get('active_workspace_id')?.value ?? null;
}

export async function createExchangeRate(input: {
  base_currency: string;
  quote_currency: string;
  rate: number;
  date?: string;
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
    .from('financial_exchange_rates')
    .insert({
      id: crypto.randomUUID(),
      base_currency: input.base_currency.toUpperCase(),
      quote_currency: input.quote_currency.toUpperCase(),
      rate: input.rate,
      date: input.date || new Date().toISOString().slice(0, 10),
      workspace_id: workspaceId,
      tenant_id: workspaceId,
      created_by: user.id,
      updated_by: user.id,
      version: 1,
    })
    .select()
    .single();

  if (error) return { ok: false as const, error: error.message };
  revalidatePath('/exchange-rates');
  return { ok: true as const, data };
}

export async function updateExchangeRate(
  id: string,
  input: { base_currency?: string; quote_currency?: string; rate?: number; date?: string }
) {
  const cookieStore = cookies();
  const workspaceId = getWorkspaceId(cookieStore);
  if (!workspaceId) return { ok: false as const, error: 'WORKSPACE_REQUIRED' };

  const supabase = createClient();
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (input.base_currency !== undefined) patch.base_currency = input.base_currency.toUpperCase();
  if (input.quote_currency !== undefined) patch.quote_currency = input.quote_currency.toUpperCase();
  if (input.rate !== undefined) patch.rate = input.rate;
  if (input.date !== undefined) patch.date = input.date;

  const { data, error } = await supabase
    .from('financial_exchange_rates')
    .update(patch)
    .eq('id', id)
    .eq('workspace_id', workspaceId)
    .select()
    .single();

  if (error) return { ok: false as const, error: error.message };
  revalidatePath('/exchange-rates');
  return { ok: true as const, data };
}

export async function deleteExchangeRate(id: string) {
  const cookieStore = cookies();
  const workspaceId = getWorkspaceId(cookieStore);
  if (!workspaceId) return { ok: false as const, error: 'WORKSPACE_REQUIRED' };

  const supabase = createClient();
  const { error } = await supabase
    .from('financial_exchange_rates')
    .delete()
    .eq('id', id)
    .eq('workspace_id', workspaceId);

  if (error) return { ok: false as const, error: error.message };
  revalidatePath('/exchange-rates');
  return { ok: true as const };
}
