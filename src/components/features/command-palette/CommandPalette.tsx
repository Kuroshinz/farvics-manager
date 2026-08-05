'use client';
import * as React from 'react';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';

export function CommandPalette({ onClose }: { onClose: () => void }) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[500] bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-[501] flex items-start justify-center pt-[15vh] px-4 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-surface/90 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] pointer-events-auto"
        >
          <div className="flex items-center border-b border-white/10 px-4">
            <Search className="text-content-secondary" size={20} />
            <input
              autoFocus
              className="flex-1 bg-transparent px-4 py-4 text-white placeholder-content-muted outline-none"
              placeholder="What do you need?"
            />
            <button onClick={onClose} className="rounded-lg p-1 text-content-secondary hover:bg-white/10 hover:text-white">
              <X size={16} />
            </button>
          </div>
          <div className="max-h-[60vh] overflow-y-auto p-2">
            <div className="px-2 py-1 text-xs font-semibold text-content-muted uppercase tracking-wider">Suggestions</div>
            <button className="w-full flex items-center gap-3 rounded-xl px-3 py-3 text-left hover:bg-white/5 text-content-secondary hover:text-white">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-galaxy-purple/20 text-galaxy-purple">
                <span className="font-bold">+$</span>
              </div>
              <span className="flex-1">Create new Transaction</span>
              <kbd className="h-5 items-center justify-center rounded border border-white/10 bg-surface px-1.5 font-mono text-[10px] text-content-muted hidden sm:flex">T</kbd>
            </button>
            <button className="w-full flex items-center gap-3 rounded-xl px-3 py-3 text-left hover:bg-white/5 text-content-secondary hover:text-white mt-1">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-aurora-cyan/20 text-aurora-cyan">
                <span className="font-bold">R</span>
              </div>
              <span className="flex-1">Generate Monthly Report</span>
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );
}
