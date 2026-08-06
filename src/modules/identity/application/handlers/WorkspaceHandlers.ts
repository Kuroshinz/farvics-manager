
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
      return Result.fail({ code: "INTERNAL_ERROR" as any, message: String(e.message) });
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
    if (error) return Result.fail({ code: "INTERNAL_ERROR" as any, message: String(error.message) });
    return Result.ok({ success: true, message: 'Invitation sent' });
  }
}
