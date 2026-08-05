import { ProjectionBuilder, ProjectionContext, IProjection } from '../../../modules/financial/projections/builders';
import { IDomainEvent } from '../../core/Events';
import { ProjectionRepository } from '../../../modules/financial/projections/repositories';

export class ProjectionExecutor {
  constructor(private readonly repository: ProjectionRepository<unknown>) {}

  async executeEvent(builder: ProjectionBuilder<unknown>, event: IDomainEvent, context: ProjectionContext): Promise<void> {
    // 1. Retrieve current projection state
    // For aggregate-specific projections, ID comes from event.aggregateId
    const projection = await this.repository.get(builder.constructor.name, event.aggregateId);

    // 2. Apply event using the builder
    let updatedProjection: IProjection<unknown>;
    if (!projection) {
      updatedProjection = builder.build([event]); // Initial build
    } else {
      updatedProjection = builder.applyEvent(projection, event, context);
    }

    // 3. Persist projection and update checkpoint natively
    // The exact checkpoint data relies on the context parameters
    await this.repository.save(event.aggregateId, updatedProjection, {
      id: event.aggregateId,
      projectionName: builder.constructor.name,
      cursor: { position: event.eventId, timestamp: context.timestamp },
      lastUpdatedAt: new Date()
    });
  }
}
