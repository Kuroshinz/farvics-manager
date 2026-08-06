
import { ICommandHandler } from '../../../../shared/application/Pipeline';
import { UpdateProfileCommand, ChangePasswordCommand } from '../commands/AuthCommands';
import { Result } from '../../../../shared/core/Result';

export class UpdateProfileHandler implements ICommandHandler<UpdateProfileCommand, Result<any>> {
  async handle(command: UpdateProfileCommand): Promise<Result<any>> {
    return Result.ok({ success: true });
  }
}
export class ChangePasswordHandler implements ICommandHandler<ChangePasswordCommand, Result<any>> {
  async handle(command: ChangePasswordCommand): Promise<Result<any>> {
    return Result.ok({ success: true });
  }
}
