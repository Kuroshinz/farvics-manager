
import * as React from 'react';
import { GlassPanel } from '../../../../components/ui/glass-panel/GlassPanel';
import { Typography } from '../../../../components/ui/typography/Typography';
import { updateProfile } from '../../../actions/auth-enterprise';

export default function ProfilePage() {
  return (
    <div className="space-y-6 animate-fade-in p-6">
      <Typography variant="h2">Hồ sơ cá nhân</Typography>
      <GlassPanel className="p-6 max-w-2xl">
        <form action={updateProfile as any} className="space-y-4">
          <div>
            <label className="block text-sm text-content-secondary mb-1">Tên hiển thị</label>
            <input name="displayName" className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white" />
          </div>
          <div>
            <label className="block text-sm text-content-secondary mb-1">Múi giờ</label>
            <select name="timezone" className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white">
              <option value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh</option>
              <option value="UTC">UTC</option>
            </select>
          </div>
          <button type="submit" className="bg-white text-black px-4 py-2 rounded-lg font-medium">Lưu thay đổi</button>
        </form>
      </GlassPanel>
    </div>
  );
}
