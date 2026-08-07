
import { AuthorizationGuard as BaseAuthGuard, ActionContext } from './ApiCore';
import { createClient } from '../../../shared/infrastructure/supabase/server';

export class AuthorizationGuard extends BaseAuthGuard {
  async authorize(context: ActionContext, requiredRoles: string[]): Promise<boolean> {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session && requiredRoles.length > 0) return false;
    if (requiredRoles.length === 0) return true;
    return requiredRoles.some(role => context.roles.includes(role));
  }
}
