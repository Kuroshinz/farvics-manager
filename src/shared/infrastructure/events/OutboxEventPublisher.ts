import { IEventPublisher, IDomainEvent } from '../../core/Events';
import { ISerializer } from '../../core/Serialization';
import { OutboxRepository } from './OutboxRepository';

export class OutboxEventPublisher implements IEventPublisher {
  constructor(
    private readonly repository: OutboxRepository,
    private readonly serializer: ISerializer
  ) {}

  async publish(event: IDomainEvent): Promise<void> {
    await this.publishMany([event]);
  }

  async publishMany(events: IDomainEvent[]): Promise<void> {
    const outboxRecords = events.map(e => ({
      id: e.eventId,
      aggregate_id: e.aggregateId,
      aggregate_type: e.aggregateType,
      event_type: e.eventType,
      payload: this.serializer.serialize(e),
      occurred_at: e.occurredAt
    }));
    await this.repository.saveMany(outboxRecords);
  }
}
