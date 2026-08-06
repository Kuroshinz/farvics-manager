const fs = require('fs');
const path = require('path');

const dirs = [
  'd:\\ManagerMn\\supabase\\migrations',
  'd:\\ManagerMn\\src\\modules\\identity\\domain',
  'd:\\ManagerMn\\src\\modules\\identity\\application\\commands',
  'd:\\ManagerMn\\src\\modules\\identity\\application\\handlers',
  'd:\\ManagerMn\\src\\modules\\identity\\infrastructure',
  'd:\\ManagerMn\\src\\app\\actions',
  'd:\\ManagerMn\\src\\app\\(auth)\\login',
  'd:\\ManagerMn\\src\\app\\(auth)\\register',
  'd:\\ManagerMn\\src\\app\\(app)\\settings\\workspaces'
];

dirs.forEach(d => fs.mkdirSync(d, { recursive: true }));

// 1. Migration
const migration = `
-- Enterprise Workspaces
CREATE TABLE public.workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID NOT NULL,
    tenant_id UUID NOT NULL,
    deleted_at TIMESTAMPTZ
);

CREATE TABLE public.workspace_members (
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID NOT NULL,
    tenant_id UUID NOT NULL,
    deleted_at TIMESTAMPTZ,
    PRIMARY KEY (workspace_id, user_id)
);

CREATE TABLE public.workspace_invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    token VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID NOT NULL,
    tenant_id UUID NOT NULL,
    deleted_at TIMESTAMPTZ
);

ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY pol_workspaces_isolation ON public.workspaces FOR ALL USING (id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()));
CREATE POLICY pol_members_isolation ON public.workspace_members FOR ALL USING (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()));
`;
fs.writeFileSync('d:\\ManagerMn\\supabase\\migrations\\20260806000001_enterprise_workspaces.sql', migration);

// 2. Domain & Application
const commands = `
import { ICommand } from '../../../../shared/application/Pipeline';
export class CreateWorkspaceCommand implements ICommand { constructor(public readonly name: string, public readonly userId: string) {} }
export class InviteMemberCommand implements ICommand { constructor(public readonly workspaceId: string, public readonly email: string, public readonly role: string, public readonly inviterId: string) {} }
`;
fs.writeFileSync('d:\\ManagerMn\\src\\modules\\identity\\application\\commands\\WorkspaceCommands.ts', commands);

const handlers = `
import { ICommandHandler } from '../../../../shared/application/Pipeline';
import { CreateWorkspaceCommand } from '../commands/WorkspaceCommands';
import { Result } from '../../../../shared/core/Result';
export class CreateWorkspaceHandler implements ICommandHandler<CreateWorkspaceCommand, Result<any>> {
  async handle(command: CreateWorkspaceCommand): Promise<Result<any>> {
    return Result.ok({ id: 'new-id', name: command.name });
  }
}
`;
fs.writeFileSync('d:\\ManagerMn\\src\\modules\\identity\\application\\handlers\\WorkspaceHandlers.ts', handlers);

// 3. Server Actions
const authActions = `
'use server';
import { createClient } from '../../shared/infrastructure/supabase/server';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email: formData.get('email') as string, password: formData.get('password') as string });
  if (error) return { error: error.message };
  redirect('/');
}
export async function logout() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect('/login');
}
`;
fs.writeFileSync('d:\\ManagerMn\\src\\app\\actions\\auth.ts', authActions);

// 4. UI Pages
const loginPage = `
import * as React from 'react';
import { login } from '../../actions/auth';
import { GlassPanel } from '../../../components/ui/glass-panel/GlassPanel';
import { Typography } from '../../../components/ui/typography/Typography';
export default function LoginPage() {
  return (
    <div className="flex h-screen items-center justify-center bg-background p-4">
      <GlassPanel className="w-full max-w-md p-8">
        <Typography variant="h2" className="mb-6 text-center">Đăng nhập</Typography>
        <form action={login} className="space-y-4">
          <input name="email" type="email" placeholder="Email" className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white" />
          <input name="password" type="password" placeholder="Mật khẩu" className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white" />
          <button type="submit" className="w-full bg-white text-black font-semibold rounded-lg p-3 hover:bg-white/90 transition-colors">Đăng nhập</button>
        </form>
      </GlassPanel>
    </div>
  );
}
`;
fs.writeFileSync('d:\\ManagerMn\\src\\app\\(auth)\\login\\page.tsx', loginPage);

