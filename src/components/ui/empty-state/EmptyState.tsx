'use client';
import * as React from 'react';
import { motion } from 'framer-motion';
import { GlassPanel } from '../glass-panel/GlassPanel';
import { Typography } from '../typography/Typography';
import { Search } from 'lucide-react';
import { useTranslation } from '../../../providers/I18nProvider';

export function EmptyState({ title, description, action }: { title?: string, description?: string, action?: React.ReactNode }) {
  const { t } = useTranslation();
  return (
    <GlassPanel className="p-12 flex flex-col items-center justify-center text-center relative overflow-hidden group">
      {/* Aurora Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-aurora-cyan/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-aurora-cyan/20 transition-colors duration-1000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-galaxy-purple/10 rounded-full blur-[60px] pointer-events-none mix-blend-screen group-hover:bg-galaxy-pink/20 transition-colors duration-1000" />

      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="relative z-10 flex flex-col items-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-inner text-aurora-cyan/80">
          <Search size={28} strokeWidth={1.5} />
        </div>
        
        <Typography variant="h3" className="mb-2 text-white">{title || t('common.no_records')}</Typography>
        <Typography variant="body" className="text-content-muted max-w-sm mb-8">
          {description || t('common.no_records_desc')}
        </Typography>

        {action && (
          <div className="mt-4">
            {action}
          </div>
        )}
      </motion.div>
    </GlassPanel>
  );
}
