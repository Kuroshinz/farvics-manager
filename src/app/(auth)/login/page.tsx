
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
