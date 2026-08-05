'use client';
import * as React from 'react';
import { motion } from 'framer-motion';
import { Search, X, Zap, Activity } from 'lucide-react';
import { Typography } from '../../ui/typography/Typography';

export function CommandPalette({ onClose }: { onClose: () => void }) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[500] bg-background/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-[501] flex items-start justify-center pt-[12vh] px-4 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: -10 }}
          transition={{ type: 'spring', stiffness: 450, damping: 35 }}
          className="w-full max-w-[640px] overflow-hidden rounded-[24px] border border-white/10 bg-surface/80 backdrop-blur-3xl shadow-[0_20px_80px_rgba(0,0,0,0.7)] pointer-events-auto relative ring-1 ring-white/5"
        >
          {/* Inner Highlight */}
          <div className="absolute inset-0 rounded-[24px] border border-white/[0.03] pointer-events-none" />

          <div className="flex items-center border-b border-white/[0.08] px-5 py-2 relative z-10 bg-black/20">
            <Search className="text-aurora-cyan shadow-aurora-cyan drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]" size={22} strokeWidth={2} />
            <input
              autoFocus
              className="flex-1 bg-transparent px-4 py-4 text-lg font-medium text-white placeholder-content-muted outline-none tracking-wide"
              placeholder="Type a command or search..."
            />
            <kbd className="hidden sm:flex h-6 items-center gap-1 rounded-md border border-white/10 bg-black/40 px-2 font-mono text-[10px] font-bold text-content-muted shadow-inner">
              ESC
            </kbd>
          </div>
          
          <div className="max-h-[50vh] overflow-y-auto p-3 relative z-10 space-y-1">
            <Typography variant="label" className="px-3 py-2 text-[10px] opacity-60">Smart Suggestions</Typography>
            
            <button className="group w-full flex items-center gap-4 rounded-2xl px-3 py-3 text-left hover:bg-white/10 transition-colors duration-200 text-content-secondary hover:text-white">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-galaxy shadow-lg opacity-80 group-hover:opacity-100 transition-opacity">
                <Zap size={18} className="text-white" />
              </div>
              <div className="flex flex-col flex-1">
                 <span className="font-medium text-sm text-white">Record Transaction</span>
                 <span className="text-xs opacity-70">Log a new expense or income</span>
              </div>
              <span className="text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity text-aurora-cyan bg-aurora-cyan/10 px-2 py-1 rounded">? Enter</span>
            </button>

            <button className="group w-full flex items-center gap-4 rounded-2xl px-3 py-3 text-left hover:bg-white/10 transition-colors duration-200 text-content-secondary hover:text-white">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-aurora-blue/20 text-aurora-cyan shadow-lg">
                <Activity size={18} />
              </div>
              <div className="flex flex-col flex-1">
                 <span className="font-medium text-sm">View Analytics</span>
                 <span className="text-xs opacity-70">Check this month&apos;s cash flow</span>
              </div>
            </button>
          </div>
          
          {/* Footer */}
          <div className="bg-black/40 px-5 py-3 border-t border-white/5 flex items-center justify-between text-[11px] font-medium text-content-muted">
            <span className="flex items-center gap-1"><Search size={12}/> to search</span>
            <span className="flex items-center gap-1">Powered by Farvics AI</span>
          </div>
        </motion.div>
      </div>
    </>
  );
}

