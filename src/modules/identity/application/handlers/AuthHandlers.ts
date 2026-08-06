
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
    if (error) return Result.fail({ code: "INTERNAL_ERROR" as any, message: String(error.message) });
    
    await supabase.from('user_preferences').upsert({ user_id: command.userId, ...command.payload });
    return Result.ok({ success: true, message: 'Profile updated' });
  }
}

export class ChangePasswordHandler implements ICommandHandler<ChangePasswordCommand, Result<any>> {
  async handle(command: ChangePasswordCommand): Promise<Result<any>> {
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: command.newPassword });
    if (error) return Result.fail({ code: "INTERNAL_ERROR" as any, message: String(error.message) });
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
