import { IMediator, ICommand, IQuery } from '../../shared/application/Pipeline';
import { ActionExecutor } from '../../shared/infrastructure/api/ActionExecutor';
import { Result } from '../../shared/core/Result';

class MockMediator implements IMediator {
  private handlers = new Map<string, any>();
  // We register both the string name and a fallback default handler
  register(commandName: string, handler: any) { 
    this.handlers.set(commandName, handler); 
    this.handlers.set('DEFAULT', handler); // Fallback for dev mode mangling
  }
  async query<TResult>(q: IQuery): Promise<TResult> { return Result.ok() as unknown as TResult; }
  async send<TResult>(command: ICommand): Promise<TResult> {
    const name = command.constructor.name;
    const handler = this.handlers.get(name) || this.handlers.get('DEFAULT');
    if (!handler) throw new Error(`No handler for ${name}`);
    return (await handler.handle(command)) as unknown as TResult;
  }
}

class MockTelemetry { start() {} recordSuccess() {} recordFailure() {} }
class MockRateLimiter { async checkLimit() { return true; } }
class MockAuthGuard { async authorize() { return true; } }
class MockIdempotency { async isDuplicate() { return false; } }
class MockValidator { async validate() { return Result.ok(); } }

export const mediator = new MockMediator();
export const actionExecutor = new ActionExecutor(
  mediator as any,
  new MockTelemetry() as any,
  new MockRateLimiter() as any,
  new MockAuthGuard() as any,
  new MockIdempotency() as any,
  new MockValidator() as any
);
