'use client';
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X } from 'lucide-react';
import { useDisclosure } from '../../../hooks';
import { Typography } from '../../ui/typography/Typography';
import { useTranslation } from '../../../providers/I18nProvider';

export function NotificationCenter() {
  const { isOpen, toggle, close } = useDisclosure();
  const { t } = useTranslation();
  
  return (
    <div className="relative">
      <button 
        onClick={toggle}
        className="relative p-2 text-content-muted hover:text-white transition-colors hover:bg-white/5 rounded-xl"
      >
        <Bell size={22} strokeWidth={1.5} />
        <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-galaxy-pink shadow-[0_0_12px_rgba(219,39,119,0.9)] border border-background" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-[490]" onClick={close} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="absolute right-0 top-full mt-2 w-80 overflow-hidden rounded-[24px] border border-white/10 bg-surface/90 backdrop-blur-3xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] z-[500]"
            >
              <div className="flex items-center justify-between border-b border-white/5 px-5 py-4 bg-black/20">
                <Typography variant="h3" className="text-sm">{t('nav.notifications') || 'Th�ng b�o'}</Typography>
                <button onClick={close} className="text-content-muted hover:text-white"><X size={16}/></button>
              </div>
              <div className="max-h-[60vh] overflow-y-auto p-2">
                 <div className="p-4 text-center text-sm text-content-muted">
                    No new notifications.
                 </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
