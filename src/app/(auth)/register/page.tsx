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
