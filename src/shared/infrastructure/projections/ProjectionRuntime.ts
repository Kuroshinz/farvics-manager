import { ProjectionRegistry } from './ProjectionRegistry';
import { ProjectionExecutor } from './ProjectionExecutor';
import { ProjectionMetricsTracker } from './ProjectionMetrics';
import { IDomainEvent } from '../../core/Events';
import { ProjectionContext } from '../../../modules/financial/projections/builders';
import { ILogger } from '../../core/Logger';

export class ProjectionRuntime {
  constructor(
    private readonly registry: ProjectionRegistry,
    private readonly executor: ProjectionExecutor,
    private readonly metrics: ProjectionMetricsTracker,
    private readonly logger: ILogger
  ) {}

  async processEvent(event: IDomainEvent, context: ProjectionContext): Promise<void> {
    const startTime = Date.now();
    try {
      const builders = this.registry.getBuildersForEvent(event.eventType);
      
      for (const builder of builders) {
        await this.executor.executeEvent(builder, event, context);
      }

      this.metrics.recordLatency(Date.now() - startTime);
    } catch (error: unknown) {
      this.metrics.incrementFailureCount();
      this.logger.error(`Failed to process event ${event.eventId} in ProjectionRuntime`, error as Error);
      throw error; // Let outer loops (Dispatcher) handle the dead-letter routing
    }
  }
}
