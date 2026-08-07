import * as React from 'react';
import { Typography } from '../typography/Typography';
import { FolderX, Plus } from 'lucide-react';

export function EmptyState({ title, description, onAction, actionLabel }: { title?: string, description: string, onAction?: () => void, actionLabel?: string, action?: React.ReactNode }) {
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
