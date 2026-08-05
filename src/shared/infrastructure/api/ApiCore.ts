export interface ActionContext {
  readonly correlationId: string;
  readonly userId?: string;
  readonly tenantId?: string;
  readonly roles: string[];
  readonly ipAddress: string;
}

export interface IActionTelemetry {
  start(actionName: string, context: ActionContext): void;
  recordSuccess(actionName: string, durationMs: number): void;
  recordFailure(actionName: string, error: unknown, durationMs: number): void;
}

export class ActionTelemetry implements IActionTelemetry {
  start(actionName: string, context: ActionContext): void {}
  recordSuccess(actionName: string, durationMs: number): void {}
  recordFailure(actionName: string, error: unknown, durationMs: number): void {}
}

export enum RateLimitTier { ANONYMOUS, AUTHENTICATED, ADMIN }

export interface IActionRateLimiter {
  checkLimit(actionName: string, context: ActionContext, tier: RateLimitTier): Promise<boolean>;
}

export class ActionRateLimiter implements IActionRateLimiter {
  async checkLimit(): Promise<boolean> { return true; }
}

export interface IIdempotencyGuard {
  isDuplicate(key: string): Promise<boolean>;
  recordExecution(key: string): Promise<void>;
}

export class IdempotencyGuard implements IIdempotencyGuard {
  async isDuplicate(): Promise<boolean> { return false; }
  async recordExecution(): Promise<void> {}
}

export class AuthorizationGuard {
  async authorize(context: ActionContext, requiredRoles: string[]): Promise<boolean> {
    if (requiredRoles.length === 0) return true;
    return requiredRoles.some(role => context.roles.includes(role));
  }
}
