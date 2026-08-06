import { EmptyState } from '../components/ui/empty-state/EmptyState';
import { translate } from '../shared/i18n/server';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background p-4 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-galaxy-purple/10 via-background to-background pointer-events-none" />
      <div className="w-full max-w-lg">
        <EmptyState 
          title={translate('error.404')} 
          description={translate('error.404_desc')}
          action={
            <Link href="/" className="px-6 py-2.5 rounded-full bg-white text-black text-sm font-semibold hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)] block mt-4">
              {translate('actions.go_home')}
            </Link>
          }
        />
      </div>
    </div>
  );
}
