
import { ICommandHandler } from '../../../../shared/application/Pipeline';
import { CreateWorkspaceCommand } from '../commands/WorkspaceCommands';
import { Result } from '../../../../shared/core/Result';
export class CreateWorkspaceHandler implements ICommandHandler<CreateWorkspaceCommand, Result<any>> {
  async handle(command: CreateWorkspaceCommand): Promise<Result<any>> {
    return Result.ok({ id: 'new-id', name: command.name });
  }
}
