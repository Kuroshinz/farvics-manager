import { IAuditBehavior } from '../../application/Behaviors';
import { RequestHandlerDelegate } from '../../application/Pipeline';
import { ICorrelationProvider } from '../../core/Context';
import { ILogger } from '../../core/Logger';
import { ICurrentUserProvider } from '../../core/Providers';

export class AuditBehavior<TRequest extends { constructor: { name: string } }, TResponse> implements IAuditBehavior<TRequest, TResponse> {
  constructor(
    private readonly correlationProvider: ICorrelationProvider,
    private readonly currentUserProvider: ICurrentUserProvider,
    private readonly logger: ILogger
  ) {}

  async handle(request: TRequest, next: RequestHandlerDelegate<TResponse>): Promise<TResponse> {
    const commandName = request.constructor.name;
    const correlationId = this.correlationProvider.getCorrelationId();
    const actor = await this.currentUserProvider.getCurrentUserId() || 'System';
    const startTime = Date.now();

    try {
      const response = await next();
      const duration = Date.now() - startTime;
      
      this.logger.info(`Audit: Command ${commandName} executed successfully`, {
        commandName,
        actor,
        correlationId,
        duration,
        success: true
      });
      
      return response;
    } catch (error: any) {
      const duration = Date.now() - startTime;
      this.logger.error(`Audit: Command ${commandName} failed`, error, {
        commandName,
        actor,
        correlationId,
        duration,
        success: false
      });
      throw error;
    }
  }
}
