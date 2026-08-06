// Value Objects

export class UserId {
  constructor(public readonly value: string) {
    if (!value || typeof value !== 'string') throw new Error('Invalid UserId');
  }
}

export class Email {
  constructor(public readonly value: string) {
    if (!value.includes('@')) throw new Error('Invalid Email format');
  }
}

export class DisplayName {
  constructor(public readonly value: string) {
    if (value.length < 2) throw new Error('DisplayName must be at least 2 characters');
  }
}

export class AvatarUrl {
  constructor(public readonly value: string) {
    if (!value.startsWith('http')) throw new Error('AvatarUrl must be a valid URL');
  }
}

export class WorkspaceId {
  constructor(public readonly value: string) {
    if (!value || typeof value !== 'string') throw new Error('Invalid WorkspaceId');
  }
}

export enum WorkspaceRole {
  Owner = 'Owner',
  Admin = 'Admin',
  Manager = 'Manager',
  Member = 'Member',
  Viewer = 'Viewer'
}

export class WorkspaceName {
  constructor(public readonly value: string) {
    if (value.length < 2 || value.length > 255) throw new Error('WorkspaceName must be between 2 and 255 characters');
  }
}
