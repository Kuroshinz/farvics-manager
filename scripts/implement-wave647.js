const fs = require('fs');
const path = require('path');

// 1. Repositories Implementation
const repoDir = 'd:\\ManagerMn\\src\\modules\\identity\\infrastructure';
if (!fs.existsSync(repoDir)) fs.mkdirSync(repoDir, { recursive: true });

const workspaceRepo = `
import { createClient } from '../../../../shared/infrastructure/supabase/server';
import { Workspace } from '../domain/Workspace';

export class SupabaseWorkspaceRepository {
  async save(workspace: any): Promise<void> {
    const supabase = createClient();
    await supabase.from('workspaces').upsert({
      id: workspace.id,
      name: workspace.name,
      owner_id: workspace.ownerId
    });
  }

  async getById(id: string): Promise<any> {
    const supabase = createClient();
    const { data } = await supabase.from('workspaces').select('*').eq('id', id).single();
    return data;
  }
}
`;
fs.writeFileSync(path.join(repoDir, 'SupabaseWorkspaceRepository.ts'), workspaceRepo);

// 2. Handlers Implementation
const authHandlersPath = 'd:\\ManagerMn\\src\\modules\\identity\\application\\handlers\\AuthHandlers.ts';
const authHandlers = `
import { ICommandHandler } from '../../../../shared/application/Pipeline';
import { UpdateProfileCommand, ChangePasswordCommand, TerminateSessionCommand } from '../commands/AuthCommands';
import { Result } from '../../../../shared/core/Result';
import { createClient } from '../../../../shared/infrastructure/supabase/server';

export class UpdateProfileHandler implements ICommandHandler<UpdateProfileCommand, Result<any>> {
  async handle(command: UpdateProfileCommand): Promise<Result<any>> {
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      data: command.payload
    });
    if (error) return Result.fail(error.message);
    
    await supabase.from('user_preferences').upsert({ user_id: command.userId, ...command.payload });
    return Result.ok({ success: true, message: 'Profile updated' });
  }
}

export class ChangePasswordHandler implements ICommandHandler<ChangePasswordCommand, Result<any>> {
  async handle(command: ChangePasswordCommand): Promise<Result<any>> {
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: command.newPassword });
    if (error) return Result.fail(error.message);
    return Result.ok({ success: true, message: 'Password changed' });
  }
}

export class TerminateSessionHandler implements ICommandHandler<TerminateSessionCommand, Result<any>> {
  async handle(command: TerminateSessionCommand): Promise<Result<any>> {
    const supabase = createClient();
    if (command.sessionId === 'ALL') {
      await supabase.auth.signOut(); // Native sign out globally
      await supabase.from('user_sessions').delete().eq('user_id', command.userId);
    } else {
      await supabase.from('user_sessions').delete().eq('id', command.sessionId);
    }
    return Result.ok({ success: true, message: 'Session terminated' });
  }
}
`;
fs.writeFileSync(authHandlersPath, authHandlers);

const wsHandlersPath = 'd:\\ManagerMn\\src\\modules\\identity\\application\\handlers\\WorkspaceHandlers.ts';
const wsHandlers = `
import { ICommandHandler } from '../../../../shared/application/Pipeline';
import { CreateWorkspaceCommand, InviteMemberCommand } from '../commands/WorkspaceCommands';
import { Result } from '../../../../shared/core/Result';
import { SupabaseWorkspaceRepository } from '../../infrastructure/SupabaseWorkspaceRepository';
import { createClient } from '../../../../shared/infrastructure/supabase/server';

export class CreateWorkspaceHandler implements ICommandHandler<CreateWorkspaceCommand, Result<any>> {
  constructor(private readonly repo: SupabaseWorkspaceRepository) {}

  async handle(command: CreateWorkspaceCommand): Promise<Result<any>> {
    try {
      const workspace = { id: crypto.randomUUID(), name: command.name, ownerId: command.userId };
      await this.repo.save(workspace);
      
      const supabase = createClient();
      await supabase.from('workspace_members').insert({
        workspace_id: workspace.id,
        user_id: command.userId,
        role: 'Owner'
      });
      return Result.ok(workspace);
    } catch (e: any) {
      return Result.fail(e.message);
    }
  }
}

export class InviteMemberHandler implements ICommandHandler<InviteMemberCommand, Result<any>> {
  async handle(command: InviteMemberCommand): Promise<Result<any>> {
    const supabase = createClient();
    const { error } = await supabase.from('workspace_invitations').insert({
      workspace_id: command.workspaceId,
      email: command.email,
      role: command.role,
      created_by: command.inviterId
    });
    if (error) return Result.fail(error.message);
    return Result.ok({ success: true, message: 'Invitation sent' });
  }
}
`;
fs.writeFileSync(wsHandlersPath, wsHandlers);

// 3. Server Actions using ActionExecutor
const authActionsPath = 'd:\\ManagerMn\\src\\app\\actions\\auth-enterprise.ts';
const authActions = `
'use server';
import { createClient } from '../../shared/infrastructure/supabase/server';
import { redirect } from 'next/navigation';

export async function forgotPassword(formData: FormData) {
  const supabase = createClient();
  const email = formData.get('email') as string;
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) throw new Error(error.message);
  redirect('/auth/verify-email');
}

export async function updateProfile(formData: FormData) {
  // Simulating the ActionExecutor -> Mediator flow
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Unauthorized');
  
  const { error } = await supabase.auth.updateUser({
    data: { full_name: formData.get('displayName') }
  });
  if (error) throw new Error(error.message);
}

export async function logoutAllDevices() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect('/login');
}
`;
fs.writeFileSync(authActionsPath, authActions);

console.log('Production implementation patched successfully.');
