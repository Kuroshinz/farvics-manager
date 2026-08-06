
import { createClient } from '../../../shared/infrastructure/supabase/server';
import { Workspace } from '../domain/Workspace';

export class SupabaseWorkspaceRepository {
  async save(workspace: any): Promise<void> {
    const supabase = createClient();
    await supabase.from('workspaces').upsert({
      id: workspace.id,
      name: workspace.name,
      owner_id: workspace.ownerId
    });
  }

  async getById(id: string): Promise<any> {
    const supabase = createClient();
    const { data } = await supabase.from('workspaces').select('*').eq('id', id).single();
    return data;
  }
}
