import { ICommandHandler } from '../../../../shared/application/Pipeline';
import { Result } from '../../../../shared/core/Result';
import { createClient } from '../../../../shared/infrastructure/supabase/server';
import { ICommand } from '../../../../shared/application/Pipeline';

export class CreateWorkspaceCommand implements ICommand {
  constructor(public readonly name: string, public readonly userId: string) {}
}

export class CreateWorkspaceHandler implements ICommandHandler<CreateWorkspaceCommand, Result<any>> {
  async handle(command: CreateWorkspaceCommand): Promise<Result<any>> {
    const supabase = createClient();
    const workspaceId = crypto.randomUUID();
    
    // Create workspace
    const { error: wError } = await supabase.from('workspaces').insert({
      id: workspaceId,
      name: command.name,
      tenant_id: workspaceId,
      created_by: command.userId
    });
    if (wError) return Result.fail({ code: "INTERNAL_ERROR" as any, message: wError.message });

    // Add owner as Admin
    const { error: mError } = await supabase.from('workspace_members').insert({
      workspace_id: workspaceId,
      user_id: command.userId,
      role: 'Admin',
      tenant_id: workspaceId,
      created_by: command.userId
    });
    if (mError) return Result.fail({ code: "INTERNAL_ERROR" as any, message: mError.message });

    return Result.ok({ id: workspaceId });
  }
}
