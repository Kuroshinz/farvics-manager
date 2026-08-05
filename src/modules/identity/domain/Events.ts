import { UserId } from './ValueObjects';

export interface DomainEvent {
  eventName: string;
  occurredAt: Date;
}

export class UserCreated implements DomainEvent {
  eventName = 'UserCreated';
  occurredAt = new Date();
  constructor(public readonly userId: UserId, public readonly email: string) {}
}

export class UserUpdated implements DomainEvent {
  eventName = 'UserUpdated';
  occurredAt = new Date();
  constructor(public readonly userId: UserId) {}
}

export class UserDeleted implements DomainEvent {
  eventName = 'UserDeleted';
  occurredAt = new Date();
  constructor(public readonly userId: UserId) {}
}

export class ProfileCompleted implements DomainEvent {
  eventName = 'ProfileCompleted';
  occurredAt = new Date();
  constructor(public readonly userId: UserId) {}
}
