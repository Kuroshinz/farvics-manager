import { IMediator, ICommand, IQuery } from '../../application/Pipeline';
import { ActionContext, IActionTelemetry, IActionRateLimiter, IIdempotencyGuard, AuthorizationGuard, RateLimitTier } from './ApiCore';
import { ValidationExecutor, ProblemDetailsMapper } from './ApiMappers';
import { Result } from '../../core/Result';
import { ProblemDetails } from '../../core/Errors';

export interface ActionDefinition<TReq, TRes> {
  name: string;
  roles: string[];
  tier: RateLimitTier;
  mapToCommand?: (req: TReq) => ICommand;
  mapToQuery?: (req: TReq) => IQuery;
}

export class ActionExecutor {
  constructor(
    private readonly mediator: IMediator,
    private readonly telemetry: IActionTelemetry,
    private readonly rateLimiter: IActionRateLimiter,
    private readonly authGuard: AuthorizationGuard,
    private readonly idempotencyGuard: IIdempotencyGuard,
    private readonly validator: ValidationExecutor
  ) {}

  async execute<TReq, TRes>(
    req: TReq,
    context: ActionContext,
    def: ActionDefinition<TReq, TRes>,
    idempotencyKey?: string
  ): Promise<TRes | ProblemDetails> {
    const startTime = Date.now();
    this.telemetry.start(def.name, context);

    try {
      if (!(await this.rateLimiter.checkLimit(def.name, context, def.tier))) {
        return { code: 'RATE_LIMIT_EXCEEDED', title: 'Rate Limit', detail: 'Too many requests', status: 429, correlationId: context.correlationId };
      }

      if (!(await this.authGuard.authorize(context, def.roles))) {
        return { code: 'FORBIDDEN', title: 'Forbidden', detail: 'Insufficient permissions', status: 403, correlationId: context.correlationId };
      }

      if (idempotencyKey && await this.idempotencyGuard.isDuplicate(idempotencyKey)) {
        return { code: 'CONFLICT', title: 'Duplicate Request', detail: 'Already processed', status: 409, correlationId: context.correlationId };
      }

      const valResult = await this.validator.validate(req);
      if (valResult.isFailure) return ProblemDetailsMapper.mapResultError(valResult, context.correlationId);

      let result: Result<TRes>;
      if (def.mapToCommand) {
        result = await this.mediator.send<Result<TRes>>(def.mapToCommand(req));
      } else if (def.mapToQuery) {
        result = await this.mediator.query<Result<TRes>>(def.mapToQuery(req));
      } else {
        throw new Error('Action must map to command or query');
      }

      if (result.isFailure) return ProblemDetailsMapper.mapResultError(result, context.correlationId);

      if (idempotencyKey) await this.idempotencyGuard.recordExecution(idempotencyKey);
      
      this.telemetry.recordSuccess(def.name, Date.now() - startTime);
      return result.getValue();
    } catch (error) {
      this.telemetry.recordFailure(def.name, error, Date.now() - startTime);
      return ProblemDetailsMapper.mapError(error, context.correlationId);
    }
  }
}
