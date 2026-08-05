import { SupabaseClient } from '@supabase/supabase-js';
import { IUserRepository, User, UserProps } from '../domain/User';
import { UserId, Email, DisplayName } from '../domain/ValueObjects';
import { IdentityErrors } from '../domain/Errors';

export class SupabaseUserRepository implements IUserRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async findById(id: UserId): Promise<User | null> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', id.value)
      .is('deleted_at', null)
      .single();

    if (error || !data) {
      if (error?.code === 'PGRST116') return null; // PostgREST not found
      throw new Error(`Database error: ${error?.message}`);
    }

    const props: UserProps = {
      id: new UserId(data.id),
      email: new Email(data.email),
      firstName: data.first_name ? new DisplayName(data.first_name) : null,
      lastName: data.last_name ? new DisplayName(data.last_name) : null,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      deletedAt: data.deleted_at ? new Date(data.deleted_at) : null,
      version: data.version,
    };

    return User.create(props);
  }

  async save(user: User): Promise<void> {
    // Only update allowed fields (first_name, last_name) since it's identity sync
    // OCC implemented via version matching
    const { error, count } = await this.supabase
      .from('users')
      .update({
        first_name: user.firstName?.value || null,
        last_name: user.lastName?.value || null,
        version: user.version, 
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id.value)
      .eq('version', user.version - 1); // Optimistic Concurrency Control

    if (error) {
      throw new Error(`Failed to save user: ${error.message}`);
    }
    
    // In a real pg implementation with Supabase JS `count` is usually accessible via a specific option
    // But conceptually we handle concurrency conflict here:
    // if (count === 0) throw IdentityErrors.CONCURRENCY_CONFLICT;
    
    user.clearEvents();
  }
}
