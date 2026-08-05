'use client';
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff } from 'lucide-react';
import { useNetworkStatus } from '../../../hooks';

export function OfflineBanner() {
  const isOnline = useNetworkStatus();

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-[1000] flex justify-center pt-2 pointer-events-none"
        >
          <div className="flex items-center gap-2 rounded-full bg-galaxy-red/20 border border-galaxy-red/30 px-4 py-1.5 backdrop-blur-xl shadow-[0_0_20px_rgba(225,29,72,0.4)] pointer-events-auto">
            <WifiOff size={14} className="text-galaxy-red" />
            <span className="text-xs font-medium text-white tracking-wide">You are currently offline</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
