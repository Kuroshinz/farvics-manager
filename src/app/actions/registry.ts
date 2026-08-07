import { IMediator, ICommand } from '../../shared/application/Pipeline';
import { ActionExecutor, ActionContext } from '../../shared/infrastructure/api/ActionExecutor';
import { Result } from '../../shared/core/Result';

class MockMediator implements IMediator {
  private handlers = new Map<string, any>();
  register(commandName: string, handler: any) { this.handlers.set(commandName, handler); }
  async query<TResult>(q: IQuery): Promise<TResult> { return Result.ok() as unknown as TResult; }
  async send<TResult>(command: ICommand): Promise<TResult> {
    const handler = this.handlers.get(command.constructor.name);
    if (!handler) throw new Error(`No handler for ${command.constructor.name}`);
    return (await handler.handle(command)) as unknown as TResult;
  }
}

class MockTelemetry { start() {} end() {} error() {} }
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
