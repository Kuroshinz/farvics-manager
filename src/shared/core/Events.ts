export interface IDomainEvent {
  readonly eventId: string;
  readonly aggregateId: string;
  readonly aggregateType: string;
  readonly aggregateVersion: number;
  readonly eventType: string;
  readonly occurredAt: Date;
  readonly actor: string;
  readonly correlationId: string;
  readonly causationId: string;
  readonly schemaVersion: string;
  readonly tenantId?: string;
  readonly metadata: Record<string, unknown>;
}

export interface IEventPublisher {
  publish(event: IDomainEvent): Promise<void>;
  publishMany(events: IDomainEvent[]): Promise<void>;
}

export interface IEventSubscriber<T extends IDomainEvent> {
  readonly eventName: string;
  readonly eventVersion?: number;
  readonly idempotencyKey?: (event: T) => string;
  filter?(event: T): boolean;
  handle(event: T): Promise<void>;
}
