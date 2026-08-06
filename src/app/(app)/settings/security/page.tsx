
import * as React from 'react';
import { GlassPanel } from '../../../../components/ui/glass-panel/GlassPanel';
import { Typography } from '../../../../components/ui/typography/Typography';
import { logoutAllDevices } from '../../../actions/auth-enterprise';

export default function SecurityPage() {
  return (
    <div className="space-y-6 animate-fade-in p-6">
      <Typography variant="h2">Bảo mật & Phiên đăng nhập</Typography>
      <GlassPanel className="p-6 max-w-2xl">
        <Typography variant="h3" className="mb-4">Phiên hoạt động</Typography>
        <div className="space-y-4 mb-6">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <Typography variant="body" className="font-medium">MacBook Pro - Chrome</Typography>
            <Typography variant="caption" className="text-content-muted">Hồ Chí Minh, VN • IP: 192.168.1.1</Typography>
          </div>
        </div>
        <form action={logoutAllDevices as any}>
          <button type="submit" className="text-galaxy-red hover:bg-galaxy-red/10 px-4 py-2 rounded-lg transition-colors font-medium border border-galaxy-red/20">
            Đăng xuất tất cả thiết bị
          </button>
        </form>
      </GlassPanel>
    </div>
  );
}
