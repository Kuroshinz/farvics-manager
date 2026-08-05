import { ICorrelationProvider, RequestContext } from '../../core/Context';
import { ILogger } from '../../core/Logger';

export class RequestMiddleware {
  constructor(
    private readonly correlationProvider: ICorrelationProvider,
    private readonly logger: ILogger
  ) {}

  async executeWithContext<T>(
    context: Partial<RequestContext>,
    next: () => Promise<T>
  ): Promise<T> {
    return this.correlationProvider.trace('HttpRequest', async () => {
      const correlationId = this.correlationProvider.getCorrelationId();
      
      this.logger.info(`Starting request`, { correlationId, ...context });
      
      try {
        const result = await next();
        this.logger.info(`Request completed`, { correlationId });
        return result;
      } catch (error) {
        this.logger.error(`Request failed`, error as Error, { correlationId });
        throw error;
      }
    });
  }
}
