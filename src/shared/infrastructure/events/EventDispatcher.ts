import { OutboxRepository } from './OutboxRepository';
import { ISerializer } from '../../core/Serialization';
import { IDomainEvent, IEventSubscriber } from '../../core/Events';

export class EventDispatcher {
  constructor(
    private readonly repository: OutboxRepository,
    private readonly serializer: ISerializer,
    private readonly subscribers: IEventSubscriber<any>[]
  ) {}

  async dispatchUnprocessed(): Promise<void> {
    const records = await this.repository.getUnprocessed(50);

    for (const record of records) {
      try {
        const event = this.serializer.deserialize<IDomainEvent>(record.payload);
        
        const relevantSubscribers = this.subscribers.filter(s => s.eventName === event.eventType);
        
        for (const sub of relevantSubscribers) {
           // Idempotency should ideally be checked here using sub.idempotencyKey
           if (sub.filter && !sub.filter(event)) continue;
           await sub.handle(event);
        }
        
        await this.repository.markProcessed(record.id);
      } catch (err: any) {
        await this.repository.markFailed(record.id, err.message || 'Unknown error');
      }
    }
  }
}
