
import { ICommand } from '../../../../shared/application/Pipeline';
export class CreateWorkspaceCommand implements ICommand { constructor(public readonly name: string, public readonly userId: string) {} }
export class InviteMemberCommand implements ICommand { constructor(public readonly workspaceId: string, public readonly email: string, public readonly role: string, public readonly inviterId: string) {} }
