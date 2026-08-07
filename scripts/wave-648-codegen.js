const fs = require('fs');
const path = require('path');

// Utility to ensure directory exists
function ensureDir(filePath) {
  const dirname = path.dirname(filePath);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }
}

// Utility to write file
function writeFile(filePath, content) {
  ensureDir(filePath);
  fs.writeFileSync(filePath, content.trim() + '\n', 'utf8');
  console.log(`[CREATED/UPDATED] ${filePath}`);
}

const root = path.join(__dirname, '..');

// 1. AUTHENTICATION: Add Register Action & Page
const authActionsPath = path.join(root, 'src/app/actions/auth-enterprise.ts');
if (fs.existsSync(authActionsPath)) {
  let authCode = fs.readFileSync(authActionsPath, 'utf8');
  if (!authCode.includes('register(')) {
    authCode += `
export async function register(formData: FormData): Promise<ProblemDetails | void> {
  const supabase = createClient();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const fullName = formData.get('full_name') as string;
  
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } }
  });
  
  if (error) return createProblem('Registration Failed', error.message);
  redirect('/verify-email');
}
`;
    fs.writeFileSync(authActionsPath, authCode, 'utf8');
    console.log(`[UPDATED] auth-enterprise.ts with register action`);
  }
}

const registerPagePath = path.join(root, 'src/app/(auth)/register/page.tsx');
writeFile(registerPagePath, `
import * as React from 'react';
import { register } from '../../actions/auth-enterprise';
import { GlassPanel } from '../../../components/ui/glass-panel/GlassPanel';
import { Typography } from '../../../components/ui/typography/Typography';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="flex h-screen items-center justify-center bg-background p-4">
      <GlassPanel className="w-full max-w-md p-8">
        <Typography variant="h2" className="mb-6 text-center">Tạo tài khoản</Typography>
        <form action={register} className="space-y-4">
          <input name="full_name" type="text" placeholder="Họ và tên" className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white" required />
          <input name="email" type="email" placeholder="Email" className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white" required />
          <input name="password" type="password" placeholder="Mật khẩu" className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white" required minLength={8} />
          <button type="submit" className="w-full bg-aurora-cyan text-black font-semibold rounded-lg p-3 hover:bg-aurora-cyan/90 transition-colors">Đăng ký</button>
        </form>
        <div className="mt-4 text-center">
          <Link href="/login" className="text-sm text-content-secondary hover:text-white transition-colors">Đã có tài khoản? Đăng nhập</Link>
        </div>
      </GlassPanel>
    </div>
  );
}
`);

// 2. EMPTY STATES & UX POLISH: Update EmptyState to include CTA
const emptyStatePath = path.join(root, 'src/components/ui/empty-state/EmptyState.tsx');
writeFile(emptyStatePath, `
import * as React from 'react';
import { Typography } from '../typography/Typography';
import { FolderX, Plus } from 'lucide-react';

export function EmptyState({ title, description, onAction, actionLabel }: { title?: string, description: string, onAction?: () => void, actionLabel?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-white/5 rounded-2xl bg-white/[0.02] backdrop-blur-md animate-fade-in">
      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6 text-content-secondary border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
        <FolderX size={28} />
      </div>
      <Typography variant="h3" className="mb-2">{title || 'Không có dữ liệu'}</Typography>
      <Typography variant="body" className="text-content-secondary max-w-md mb-6">{description}</Typography>
      {onAction && actionLabel && (
        <button onClick={onAction} className="flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-lg font-semibold hover:bg-white/90 transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
          <Plus size={18} /> {actionLabel}
        </button>
      )}
    </div>
  );
}
`);

// 3. DASHBOARD: Real Charts with Recharts
const dynamicChartPath = path.join(root, 'src/components/features/dashboard/DynamicChart.tsx');
writeFile(dynamicChartPath, `
'use client';
import * as React from 'react';
import { GlassPanel } from '../../ui/glass-panel/GlassPanel';
import { Typography } from '../../ui/typography/Typography';
import { useTranslation } from '../../../providers/I18nProvider';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'T2', revenue: 4000, expenses: 2400 },
  { name: 'T3', revenue: 3000, expenses: 1398 },
  { name: 'T4', revenue: 2000, expenses: 9800 },
  { name: 'T5', revenue: 2780, expenses: 3908 },
  { name: 'T6', revenue: 1890, expenses: 4800 },
  { name: 'T7', revenue: 2390, expenses: 3800 },
  { name: 'CN', revenue: 3490, expenses: 4300 },
];

export default function DynamicChartWidget({ amount = "0 ₫" }: { amount?: string }) {
  const { t } = useTranslation();
  return (
    <GlassPanel className="p-6 h-full flex flex-col relative overflow-hidden group">
      <div className="flex justify-between items-center mb-6 relative z-10">
        <div>
          <Typography variant="label" className="opacity-70">{t('dashboard.cash_flow_velocity')}</Typography>
          <Typography variant="h2" className="mt-1">{amount}</Typography>
        </div>
        <div className="flex gap-2">
          {['1W', '1M', '1Y'].map(t => (
            <button key={t} className="px-3 py-1 rounded-lg text-xs font-medium border border-white/10 bg-white/5 hover:bg-white/10 text-content-secondary hover:text-white transition-colors">{t}</button>
          ))}
        </div>
      </div>
      
      <div className="flex-1 w-full relative min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#06B6D4" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
            <Area type="monotone" dataKey="revenue" stroke="#06B6D4" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </GlassPanel>
  );
}
`);

// 4. CQRS WORKSPACE: Generate missing command handlers
const workspaceHandlersPath = path.join(root, 'src/modules/identity/application/handlers/WorkspaceHandlers.ts');
writeFile(workspaceHandlersPath, `
import { ICommandHandler } from '../../../../shared/application/Pipeline';
import { Result } from '../../../../shared/core/Result';
import { createClient } from '../../../../shared/infrastructure/supabase/server';
import { ICommand } from '../../../../shared/application/Pipeline';

export class CreateWorkspaceCommand implements ICommand {
  constructor(public readonly name: string, public readonly userId: string) {}
}

export class CreateWorkspaceHandler implements ICommandHandler<CreateWorkspaceCommand, Result<any>> {
  async handle(command: CreateWorkspaceCommand): Promise<Result<any>> {
    const supabase = createClient();
    const workspaceId = crypto.randomUUID();
    
    // Create workspace
    const { error: wError } = await supabase.from('workspaces').insert({
      id: workspaceId,
      name: command.name,
      tenant_id: workspaceId,
      created_by: command.userId
    });
    if (wError) return Result.fail({ code: "INTERNAL_ERROR" as any, message: wError.message });

    // Add owner as Admin
    const { error: mError } = await supabase.from('workspace_members').insert({
      workspace_id: workspaceId,
      user_id: command.userId,
      role: 'Admin',
      tenant_id: workspaceId,
      created_by: command.userId
    });
    if (mError) return Result.fail({ code: "INTERNAL_ERROR" as any, message: mError.message });

    return Result.ok({ id: workspaceId });
  }
}
`);

console.log('Codegen complete.');
