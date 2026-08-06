
import { ICommand } from '../../../../shared/application/Pipeline';
export class UpdateProfileCommand implements ICommand { constructor(public readonly userId: string, public readonly payload: any) {} }
export class ChangePasswordCommand implements ICommand { constructor(public readonly userId: string, public readonly newPassword: string) {} }
export class TerminateSessionCommand implements ICommand { constructor(public readonly userId: string, public readonly sessionId: string) {} }
