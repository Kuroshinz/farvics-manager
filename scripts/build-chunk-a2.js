const fs = require('fs');

const wsActionsPath = 'd:\\ManagerMn\\src\\app\\actions\\workspaces.ts';
const wsActions = `
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
`;
fs.writeFileSync(wsActionsPath, wsActions);

const switcherPath = 'd:\\ManagerMn\\src\\components\\features\\workspace-switcher\\WorkspaceSwitcher.tsx';
let switcher = fs.readFileSync(switcherPath, 'utf8');

// Replace mock with actual fetch
switcher = switcher.replace("const workspaces = [t('common.farvics_hq'), 'Personal Portfolio', 'Acme Corp Sandbox'];", "const [workspaces, setWorkspaces] = React.useState<any[]>([]);");
switcher = switcher.replace("const [active, setActive] = React.useState(workspaces[0]);", `
  const [active, setActive] = React.useState<any>(null);

  React.useEffect(() => {
    import('../../../app/actions/workspaces').then(m => {
      m.fetchWorkspaces().then(data => {
        setWorkspaces(data);
        if (data.length > 0) setActive(data[0]);
      });
    });
  }, []);
`);
switcher = switcher.replace(/active\.substring/g, "active?.name?.substring");
switcher = switcher.replace(/\{active\}/g, "{active?.name}");
switcher = switcher.replace(/workspaces\.map\(\(ws\)/, "workspaces.map((ws)");
switcher = switcher.replace(/key=\{ws\}/, "key={ws.id}");
switcher = switcher.replace(/onClick=\{.*?setActive\(ws\).*?\}/, "onClick={() => { setActive(ws); setIsOpen(false); import('../../../app/actions/workspaces').then(m => m.switchWorkspace(ws.id)); }}");
switcher = switcher.replace(/\{ws\}/g, "{ws.name}");
switcher = switcher.replace(/active === ws/g, "active?.id === ws.id");

fs.writeFileSync(switcherPath, switcher);

