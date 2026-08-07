import { IMediator, ICommand } from '../../shared/application/Pipeline';
import { ActionExecutor, ActionContext } from '../../shared/infrastructure/api/ActionExecutor';
import { Result } from '../../shared/core/Result';

class MockMediator implements IMediator {
  private handlers = new Map<string, any>();
  register(commandName: string, handler: any) { this.handlers.set(commandName, handler); }
  async query(q: any): Promise<Result<any>> { return Result.ok(); }
  async send(command: ICommand): Promise<Result<any>> {
    const handler = this.handlers.get(command.constructor.name);
    if (!handler) throw new Error(`No handler for ${command.constructor.name}`);
    return handler.handle(command);
  }
}

class MockTelemetry { start() {} end() {} error() {} }
class MockRateLimiter { async checkLimit() { return true; } }
class MockAuthGuard { async authorize() { return true; } }
class MockIdempotency { async isDuplicate() { return false; } }
class MockValidator { async validate() { return Result.ok(); } }

export const mediator = new MockMediator();
export const actionExecutor = new ActionExecutor(
  mediator,
  new MockTelemetry() as any,
  new MockRateLimiter() as any,
  new MockAuthGuard() as any,
  new MockIdempotency() as any,
  new MockValidator() as any
);
