'use client';
import { EmptyState } from '../components/ui/empty-state/EmptyState';
import Link from 'next/link';

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background p-4 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-galaxy-red/10 via-background to-background pointer-events-none" />
      <div className="w-full max-w-lg">
        <EmptyState 
          title="Lỗi hệ thống" 
          description="Đã xảy ra lỗi hệ thống cục bộ. Đội ngũ kỹ thuật đã được thông báo."
          action={
            <div className="flex gap-4 mt-4 justify-center">
              <button onClick={() => reset()} className="px-6 py-2.5 rounded-full border border-white/10 text-white text-sm font-semibold hover:bg-white/5 transition-colors">
                Thử lại
              </button>
              <Link href="/" className="px-6 py-2.5 rounded-full bg-white text-black text-sm font-semibold hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)] block">
                Quay lại trang chủ
              </Link>
            </div>
          }
        />
      </div>
    </div>
  );
}
