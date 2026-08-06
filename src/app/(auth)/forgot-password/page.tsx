export const dynamic = 'force-dynamic';

import * as React from 'react';
import { forgotPassword } from '../../actions/auth-enterprise';
import { GlassPanel } from '../../../components/ui/glass-panel/GlassPanel';
import { Typography } from '../../../components/ui/typography/Typography';

export default function ForgotPassword() {
  return (
    <div className="flex h-screen items-center justify-center bg-background p-4">
      <GlassPanel className="w-full max-w-md p-8">
        <Typography variant="h2" className="mb-2 text-center">Quên mật khẩu</Typography>
        <Typography variant="body" className="mb-6 text-center text-content-muted">Nhập email để đặt lại mật khẩu.</Typography>
        <form action={forgotPassword as any} className="space-y-4">
          <input name="email" type="email" placeholder="Email" className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white" />
          <button type="submit" className="w-full bg-white text-black font-semibold rounded-lg p-3">Gửi yêu cầu</button>
        </form>
      </GlassPanel>
    </div>
  );
}
