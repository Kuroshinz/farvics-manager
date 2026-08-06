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

export class WorkspaceCreated implements DomainEvent {
  eventName = 'WorkspaceCreated';
  occurredAt = new Date();
  constructor(public readonly workspaceId: string, public readonly name: string, public readonly ownerId: string) {}
}

export class WorkspaceMemberInvited implements DomainEvent {
  eventName = 'WorkspaceMemberInvited';
  occurredAt = new Date();
  constructor(public readonly workspaceId: string, public readonly userId: string, public readonly role: string) {}
}

export class WorkspaceMemberRemoved implements DomainEvent {
  eventName = 'WorkspaceMemberRemoved';
  occurredAt = new Date();
  constructor(public readonly workspaceId: string, public readonly userId: string) {}
}
