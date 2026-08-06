const fs = require('fs');

// 1. Profile Actions Update
const authActionsPath = 'd:\\ManagerMn\\src\\app\\actions\\auth-enterprise.ts';
let authActions = fs.readFileSync(authActionsPath, 'utf8');
authActions = authActions.replace(/export async function updateProfile.*?\}\n/s, `
export async function updateProfile(formData: FormData) {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Unauthorized');
  
  const updates = {
    full_name: formData.get('displayName'),
    timezone: formData.get('timezone'),
    language: formData.get('language'),
    avatar_url: formData.get('avatarUrl')
  };

  const { error } = await supabase.auth.updateUser({ data: updates });
  if (error) throw new Error(error.message);
  
  // Upsert preferences
  await supabase.from('user_preferences').upsert({
    user_id: session.user.id,
    timezone: updates.timezone,
    language: updates.language
  });
}
`);
fs.writeFileSync(authActionsPath, authActions);

// 2. Profile Page UI
const profilePagePath = 'd:\\ManagerMn\\src\\app\\(app)\\settings\\profile\\page.tsx';
const profilePage = `
'use client';
import * as React from 'react';
import { GlassPanel } from '../../../../components/ui/glass-panel/GlassPanel';
import { Typography } from '../../../../components/ui/typography/Typography';
import { updateProfile } from '../../../actions/auth-enterprise';
import { useFormStatus } from 'react-dom';
import { createBrowserClient } from '@supabase/ssr';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="bg-white text-black px-6 py-2.5 rounded-xl font-semibold hover:bg-white/90 transition-colors disabled:opacity-50">
      {pending ? 'Đang lưu...' : 'Lưu thay đổi'}
    </button>
  );
}

export default function ProfilePage() {
  const [avatarUrl, setAvatarUrl] = React.useState<string>('');
  const [uploading, setUploading] = React.useState(false);
  const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) return;
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const filePath = \`\${user.id}/avatar-\${Math.random()}.\${fileExt}\`;
      
      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file);
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      setAvatarUrl(data.publicUrl);
    } catch (error) {
      console.error('Error uploading avatar:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in p-6">
      <Typography variant="h2">Hồ sơ cá nhân</Typography>
      <GlassPanel className="p-8 max-w-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-galaxy-pink/10 rounded-full blur-[80px] pointer-events-none" />
        <form action={updateProfile as any} className="space-y-6 relative z-10">
          <input type="hidden" name="avatarUrl" value={avatarUrl} />
          
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-2xl bg-white/5 border border-white/10 overflow-hidden relative">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-content-muted">?</div>
              )}
            </div>
            <div>
              <label className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors text-sm font-medium">
                {uploading ? 'Đang tải lên...' : 'Đổi ảnh đại diện'}
                <input type="file" accept="image/*" onChange={uploadAvatar} className="hidden" disabled={uploading} />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-content-secondary mb-2 font-medium">Tên hiển thị</label>
              <input name="displayName" className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-aurora-cyan/50 transition-all" />
            </div>
            <div>
              <label className="block text-sm text-content-secondary mb-2 font-medium">Email</label>
              <input name="email" type="email" disabled className="w-full bg-white/5 border border-white/5 rounded-xl p-3 text-content-muted cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-sm text-content-secondary mb-2 font-medium">Ngôn ngữ</label>
              <select name="language" className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-aurora-cyan/50 transition-all appearance-none">
                <option value="vi">Tiếng Việt</option>
                <option value="en">English</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-content-secondary mb-2 font-medium">Múi giờ</label>
              <select name="timezone" className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-aurora-cyan/50 transition-all appearance-none">
                <option value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh</option>
                <option value="UTC">UTC</option>
              </select>
            </div>
          </div>
          
          <div className="pt-4 border-t border-white/10">
            <SubmitButton />
          </div>
        </form>
      </GlassPanel>
    </div>
  );
}
`;
fs.writeFileSync(profilePagePath, profilePage);

