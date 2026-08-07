import { ICommand } from '../../../shared/application/Pipeline';
import { Result } from '../../../shared/core/Result';
import { createClient } from '../../../shared/infrastructure/supabase/server';
import { cookies } from 'next/headers';

// 1. Commands
export class CreateAccountCommand implements ICommand {
  constructor(public readonly name: string, public readonly currency_code: string, public readonly balance: number, public readonly workspaceId: string, public readonly userId: string) {}
}

export class UpdateAccountCommand implements ICommand {
  constructor(public readonly id: string, public readonly payload: any, public readonly workspaceId: string) {}
}

export class DeleteAccountCommand implements ICommand {
  constructor(public readonly id: string, public readonly workspaceId: string) {}
}

export class ArchiveAccountCommand implements ICommand {
  constructor(public readonly id: string, public readonly workspaceId: string) {}
}

export class RestoreAccountCommand implements ICommand {
  constructor(public readonly id: string, public readonly workspaceId: string) {}
}

// 2. Repository Interface & Implementation (SupabaseAccountRepository)
export interface IAccountRepository {
  insert(account: any): Promise<Result<any>>;
  update(id: string, payload: any, workspaceId: string): Promise<Result<any>>;
  delete(id: string, workspaceId: string): Promise<Result<any>>;
}

export class SupabaseAccountRepository implements IAccountRepository {
  async insert(account: any): Promise<Result<any>> {
    const supabase = createClient();
    const { data, error } = await supabase.from('financial_accounts').insert(account).select().single();
    if (error) return Result.fail({ code: 'ERR', message: error.message } as any);
    return Result.ok(data);
  }
  async update(id: string, payload: any, workspaceId: string): Promise<Result<any>> {
    const supabase = createClient();
    const { data, error } = await supabase.from('financial_accounts').update(payload).eq('id', id).eq('workspace_id', workspaceId).select().single();
    if (error) return Result.fail({ code: 'ERR', message: error.message } as any);
    return Result.ok(data);
  }
  async delete(id: string, workspaceId: string): Promise<Result<any>> {
    const supabase = createClient();
    const { error } = await supabase.from('financial_accounts').delete().eq('id', id).eq('workspace_id', workspaceId);
    if (error) return Result.fail({ code: 'ERR', message: error.message } as any);
    return Result.ok();
  }
}

// 3. Aggregate
export class AccountAggregate {
  static create(cmd: CreateAccountCommand) {
    // Business invariant logic & Domain Events here
    // For PAT, we simulate the Outbox append by just returning the shaped payload
    return {
      id: crypto.randomUUID(),
      name: cmd.name,
      currency_code: cmd.currency_code,
      status: 'Active',
      balance: cmd.balance,
      workspace_id: cmd.workspaceId,
      tenant_id: cmd.workspaceId,
      created_by: cmd.userId,
      updated_by: cmd.userId,
      version: 1
    };
  }
}

// 4. Handlers
export class AccountHandlers {
  constructor(private readonly repo: IAccountRepository) {}

  async handle(command: ICommand): Promise<Result<any>> {
    if (command instanceof CreateAccountCommand) {
      const aggregate = AccountAggregate.create(command);
      // Simulated Outbox Commit
      return await this.repo.insert(aggregate);
    }
    if (command instanceof UpdateAccountCommand) {
      return await this.repo.update(command.id, command.payload, command.workspaceId);
    }
    if (command instanceof DeleteAccountCommand) {
      return await this.repo.delete(command.id, command.workspaceId);
    }
    if (command instanceof ArchiveAccountCommand) {
      return await this.repo.update(command.id, { deleted_at: new Date().toISOString(), updated_at: new Date().toISOString() }, command.workspaceId);
    }
    if (command instanceof RestoreAccountCommand) {
      return await this.repo.update(command.id, { deleted_at: null, updated_at: new Date().toISOString() }, command.workspaceId);
    }
    return Result.fail({ code: 'ERR', message: 'Unknown command' } as any);
  }
}
