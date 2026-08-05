'use server';

// Mocking DI Container resolution for Next.js actions
import { ActionExecutor } from '../../shared/infrastructure/api/ActionExecutor';
import { ActionContext, RateLimitTier } from '../../shared/infrastructure/api/ApiCore';
import { CreateJournalCommand, PostJournalCommand, ReverseJournalCommand } from '../../modules/financial/application/commands';
import { CreateJournalRequest, JournalResponse } from '../../modules/financial/application/dto';
import { ProblemDetails } from '../../shared/core/Errors';

// Helper to mock fetching the context and executor (In reality, injected via a Server Action wrapper)
async function getContext(): Promise<ActionContext> {
  return { correlationId: 'req-123', roles: ['USER'], ipAddress: '127.0.0.1' };
}
async function getExecutor(): Promise<ActionExecutor> { return {} as ActionExecutor; }

export async function createJournal(req: CreateJournalRequest, idempotencyKey?: string): Promise<JournalResponse | ProblemDetails> {
  const context = await getContext();
  const executor = await getExecutor();
  
  return executor.execute(
    req, 
    context, 
    {
      name: 'CreateJournal',
      roles: ['USER'],
      tier: RateLimitTier.AUTHENTICATED,
      mapToCommand: (r) => new CreateJournalCommand(r)
    },
    idempotencyKey
  );
}

export async function postJournal(journalId: string): Promise<JournalResponse | ProblemDetails> {
  const context = await getContext();
  const executor = await getExecutor();
  
  return executor.execute(
    { journalId }, 
    context, 
    {
      name: 'PostJournal',
      roles: ['USER', 'ACCOUNTANT'],
      tier: RateLimitTier.AUTHENTICATED,
      mapToCommand: (r) => new PostJournalCommand(r.journalId)
    }
  );
}

export async function reverseJournal(journalId: string, reversalDate: Date): Promise<JournalResponse | ProblemDetails> {
  const context = await getContext();
  const executor = await getExecutor();
  
  return executor.execute(
    { journalId, reversalDate }, 
    context, 
    {
      name: 'ReverseJournal',
      roles: ['ADMIN', 'ACCOUNTANT'],
      tier: RateLimitTier.AUTHENTICATED,
      mapToCommand: (r) => new ReverseJournalCommand(r.journalId, r.reversalDate)
    }
  );
}
