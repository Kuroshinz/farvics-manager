import { IEventPublisher, IDomainEvent } from '../../core/Events';

export class FakeEventPublisher implements IEventPublisher {
  public publishedEvents: IDomainEvent[] = [];

  async publish(event: IDomainEvent): Promise<void> {
    this.publishedEvents.push(event);
  }

  async publishMany(events: IDomainEvent[]): Promise<void> {
    this.publishedEvents.push(...events);
  }
  
  clear(): void {
    this.publishedEvents = [];
  }
}
