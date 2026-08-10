'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { createClient } from '../../shared/infrastructure/supabase/server';
import { actionExecutor, mediator } from './registry';
import { 
  CreateAccountCommand, UpdateAccountCommand, DeleteAccountCommand, ArchiveAccountCommand, RestoreAccountCommand,
  SupabaseAccountRepository, AccountHandlers 
} from '../../modules/financial/application/accounts.cqrs';

// Register Handlers locally since we are bypassing the heavy DI container for the 6.4.13A PAT.
const handler = new AccountHandlers(new SupabaseAccountRepository());
mediator.register('CreateAccountCommand', handler);
mediator.register('UpdateAccountCommand', handler);
mediator.register('DeleteAccountCommand', handler);
mediator.register('ArchiveAccountCommand', handler);
mediator.register('RestoreAccountCommand', handler);

function getWorkspaceId(cookieStore: any): string | null {
  return cookieStore.get('active_workspace_id')?.value ?? null;
}

export async function createAccount(input: {
  name: string;
  currency_code: string;
  status?: string;
  balance?: number;
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

  const cmd = new CreateAccountCommand(input.name, input.currency_code || 'VND', Math.round((input.balance ?? 0) * 100), workspaceId, user.id);
  const result = await actionExecutor.execute(cmd, {} as any, { name: 'Action', roles: [], tier: 'Standard' as any, mapToCommand: () => cmd });
  
  if ((result as any)?.code) return { ok: false as const, error: (result as any).detail };
  if ((result as any).isFailure) return { ok: false as const, error: (result as any).error };
  
  revalidatePath('/accounts');
  return { ok: true as const, data: (result as any).getValue() };
}

export async function updateAccount(id: string, input: any) {
  const cookieStore = cookies();
  const workspaceId = getWorkspaceId(cookieStore);
  if (!workspaceId) return { ok: false as const, error: 'WORKSPACE_REQUIRED' };

  const patch: any = { updated_at: new Date().toISOString() };
  if (input.name !== undefined) patch.name = input.name;
  if (input.status !== undefined) patch.status = input.status;
  if (input.currency_code !== undefined) patch.currency_code = input.currency_code;
  if (input.balance !== undefined) patch.balance = Math.round(input.balance * 100);

  const cmd = new UpdateAccountCommand(id, patch, workspaceId);
  const result = await actionExecutor.execute(cmd, {} as any, { name: 'UpdateAccount', roles: [], tier: 'Standard' as any, mapToCommand: () => cmd });
  
  if ((result as any)?.code) return { ok: false as const, error: (result as any).detail };
  revalidatePath('/accounts');
  return { ok: true as const, data: (result as any).getValue?.() };
}

export async function deleteAccount(id: string) {
  const cookieStore = cookies();
  const workspaceId = getWorkspaceId(cookieStore);
  if (!workspaceId) return { ok: false as const, error: 'WORKSPACE_REQUIRED' };

  const cmd = new DeleteAccountCommand(id, workspaceId);
  const result = await actionExecutor.execute(cmd, {} as any, { name: 'DeleteAccount', roles: [], tier: 'Standard' as any, mapToCommand: () => cmd });
  
  revalidatePath('/accounts');
  return { ok: true as const };
}

export async function archiveAccount(id: string) {
  const cookieStore = cookies();
  const workspaceId = getWorkspaceId(cookieStore);
  if (!workspaceId) return { ok: false as const, error: 'WORKSPACE_REQUIRED' };

  const cmd = new ArchiveAccountCommand(id, workspaceId);
  const result = await actionExecutor.execute(cmd, {} as any, { name: 'ArchiveAccount', roles: [], tier: 'Standard' as any, mapToCommand: () => cmd });
  
  revalidatePath('/accounts');
  return { ok: true as const };
}

export async function restoreAccount(id: string) {
  const cookieStore = cookies();
  const workspaceId = getWorkspaceId(cookieStore);
  if (!workspaceId) return { ok: false as const, error: 'WORKSPACE_REQUIRED' };

  const cmd = new RestoreAccountCommand(id, workspaceId);
  const result = await actionExecutor.execute(cmd, {} as any, { name: 'RestoreAccount', roles: [], tier: 'Standard' as any, mapToCommand: () => cmd });
  
  revalidatePath('/accounts');
  return { ok: true as const };
}
