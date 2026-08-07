'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { login } from '../../actions/auth';
import { GlassPanel } from '../../../components/ui/glass-panel/GlassPanel';
import { Typography } from '../../../components/ui/typography/Typography';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import Link from 'next/link';

const schema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(8, 'Mật khẩu phải có ít nhất 8 ký tự'),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setServerError(null);
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('password', data.password);

    const result = await login(formData) as any;
    if (result && result.detail) {
      setServerError(result.detail);
    } else if (result && result.ok) {
      window.location.href = result.redirectUrl;
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-black overflow-hidden relative p-4">
      {/* Aurora Background Effects */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-aurora-cyan/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-galaxy-red/10 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md z-10"
      >
        <GlassPanel className="p-8 md:p-10 border border-white/10 shadow-2xl backdrop-blur-3xl bg-black/40 rounded-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent pointer-events-none" />
          
          <div className="relative z-10">
            <Typography variant="h2" className="mb-2 text-center bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">
              Đăng nhập
            </Typography>
            <Typography variant="body" className="mb-8 text-center text-content-secondary">
              Chào mừng trở lại Farvics Manager
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-content-secondary mb-1.5 ml-1">Email</label>
                <input
                  {...register('email')}
                  type="email"
                  placeholder="name@company.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-white placeholder-white/30 outline-none focus:border-aurora-cyan/50 focus:bg-white/10 transition-all"
                />
                {errors.email && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-galaxy-red text-xs mt-1.5 ml-1">
                    {errors.email.message}
                  </motion.p>
                )}
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5 ml-1">
                  <label className="block text-xs font-medium text-content-secondary">Mật khẩu</label>
                  <Link href="/forgot-password" className="text-xs text-aurora-cyan hover:text-white transition-colors">
                    Quên mật khẩu?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 pr-12 text-white placeholder-white/30 outline-none focus:border-aurora-cyan/50 focus:bg-white/10 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-galaxy-red text-xs mt-1.5 ml-1">
                    {errors.password.message}
                  </motion.p>
                )}
              </div>

              {serverError && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="p-3 bg-galaxy-red/10 border border-galaxy-red/20 rounded-lg">
                  <p className="text-galaxy-red text-xs text-center">{serverError}</p>
                </motion.div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-white text-black font-semibold rounded-xl p-3.5 hover:bg-white/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
              >
                {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                {isSubmitting ? 'Đang xử lý...' : 'Đăng nhập'}
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-content-secondary">
              Chưa có tài khoản?{' '}
              <Link href="/register" className="text-white hover:text-aurora-cyan transition-colors font-medium">
                Đăng ký ngay
              </Link>
            </div>
          </div>
        </GlassPanel>
      </motion.div>
    </div>
  );
}
