
'use server';
import { createClient } from '../../shared/infrastructure/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function fetchWorkspaces() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase.from('workspace_members')
    .select('workspace_id, role, workspaces(id, name)')
    .eq('user_id', user.id);
  
  if (!data) return [];
  return data.map((item: any) => ({
    id: item.workspace_id,
    name: item.workspaces.name,
    role: item.role
  }));
}

export async function switchWorkspace(workspaceId: string) {
  cookies().set('active_workspace_id', workspaceId, { path: '/' });
  redirect('/');
}
