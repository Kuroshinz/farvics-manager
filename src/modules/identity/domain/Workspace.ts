export abstract class Entity<T> { constructor(public readonly id: T) {} }
export abstract class AggregateRoot<T> extends Entity<T> { public addDomainEvent(event: any) {} }
import { WorkspaceId, WorkspaceName, UserId, WorkspaceRole } from './ValueObjects';
import * as Events from './Events';

export class WorkspaceMember extends Entity<string> {
  constructor(
    id: string,
    public readonly userId: UserId,
    public role: WorkspaceRole,
    public readonly joinedAt: Date
  ) {
    super(id);
  }

  updateRole(newRole: WorkspaceRole) {
    this.role = newRole;
  }
}

export class Workspace extends AggregateRoot<WorkspaceId> {
  private _members: WorkspaceMember[] = [];
  
  constructor(
    id: WorkspaceId,
    public name: WorkspaceName,
    public readonly ownerId: UserId,
    members: WorkspaceMember[] = []
  ) {
    super(id);
    this._members = members;
  }

  get members(): ReadonlyArray<WorkspaceMember> {
    return this._members;
  }

  static create(id: string, name: string, ownerId: string): Workspace {
    const workspaceId = new WorkspaceId(id);
    const workspace = new Workspace(workspaceId, new WorkspaceName(name), new UserId(ownerId));
    
    // Owner is automatically an Admin/Owner
    const member = new WorkspaceMember(
      `${id}-${ownerId}`,
      new UserId(ownerId),
      WorkspaceRole.Owner,
      new Date()
    );
    workspace._members.push(member);
    
    workspace.addDomainEvent(new Events.WorkspaceCreated(workspaceId.value, name, ownerId));
    return workspace;
  }

  inviteMember(inviterId: string, targetUserId: string, role: WorkspaceRole) {
    const inviter = this._members.find(m => m.userId.value === inviterId);
    if (!inviter) throw new Error('Inviter is not a member of this workspace');
    if (inviter.role !== WorkspaceRole.Owner && inviter.role !== WorkspaceRole.Admin) {
       throw new Error('Only Admins or Owners can invite members');
    }

    if (this._members.find(m => m.userId.value === targetUserId)) {
      throw new Error('User is already a member');
    }

    const member = new WorkspaceMember(
      `${this.id.value}-${targetUserId}`,
      new UserId(targetUserId),
      role,
      new Date()
    );
    this._members.push(member);

    this.addDomainEvent(new Events.WorkspaceMemberInvited(this.id.value, targetUserId, role));
  }

  removeMember(removerId: string, targetUserId: string) {
    const remover = this._members.find(m => m.userId.value === removerId);
    if (!remover) throw new Error('Remover is not a member of this workspace');
    
    if (removerId !== targetUserId && remover.role !== WorkspaceRole.Owner && remover.role !== WorkspaceRole.Admin) {
       throw new Error('Only Admins or Owners can remove other members');
    }

    const targetIndex = this._members.findIndex(m => m.userId.value === targetUserId);
    if (targetIndex === -1) throw new Error('User is not a member');

    if (this._members[targetIndex].role === WorkspaceRole.Owner) {
       throw new Error('Cannot remove the workspace owner');
    }

    this._members.splice(targetIndex, 1);
    this.addDomainEvent(new Events.WorkspaceMemberRemoved(this.id.value, targetUserId));
  }

  updateRole(updaterId: string, targetUserId: string, newRole: WorkspaceRole) {
    const updater = this._members.find(m => m.userId.value === updaterId);
    if (!updater || (updater.role !== WorkspaceRole.Owner && updater.role !== WorkspaceRole.Admin)) {
       throw new Error('Only Admins or Owners can update roles');
    }

    const target = this._members.find(m => m.userId.value === targetUserId);
    if (!target) throw new Error('User is not a member');

    if (target.role === WorkspaceRole.Owner) {
       throw new Error('Cannot change the role of the workspace owner');
    }

    target.updateRole(newRole);
    // Add event if necessary
  }
}
