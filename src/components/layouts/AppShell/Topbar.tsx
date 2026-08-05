'use client';
import * as React from 'react';
import { Search, Bell, Command, Settings2 } from 'lucide-react';
import { motion } from 'framer-motion';

export function Topbar({ onOpenCommandPalette }: { onOpenCommandPalette: () => void }) {
  return (
    <header className="sticky top-0 z-20 flex h-24 shrink-0 items-center gap-x-4 bg-transparent px-6 sm:px-10">
      <div className="flex flex-1 gap-x-6 self-stretch items-center">
        {/* Arc Browser styled floating command trigger */}
        <div className="flex flex-1 items-center max-w-2xl">
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={onOpenCommandPalette}
            className="group flex w-full items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] px-4 py-3 text-sm text-content-secondary transition-all shadow-[0_4px_24px_rgba(0,0,0,0.2)] hover:shadow-[0_4px_32px_rgba(255,255,255,0.03)] backdrop-blur-xl"
          >
            <Search size={18} className="text-content-muted group-hover:text-white transition-colors" strokeWidth={1.5} />
            <span className="flex-1 text-left font-medium tracking-wide">Command Center...</span>
            <kbd className="hidden sm:flex h-6 items-center gap-1 rounded-md border border-white/10 bg-black/20 px-2 font-mono text-[11px] font-medium text-content-muted shadow-inner group-hover:text-white transition-colors">
              <Command size={11} /> K
            </kbd>
          </motion.button>
        </div>
        
        <div className="flex items-center gap-x-6 ml-auto">
          {/* Status Indicator */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full border border-aurora-green/20 bg-aurora-green/5">
             <span className="relative flex h-2 w-2">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-aurora-green opacity-75"></span>
               <span className="relative inline-flex rounded-full h-2 w-2 bg-aurora-green shadow-[0_0_8px_rgba(5,150,105,0.8)]"></span>
             </span>
             <span className="text-[11px] font-semibold text-aurora-green uppercase tracking-widest">Operational</span>
          </div>

          <div className="h-6 w-px bg-white/10 hidden sm:block" />

          <button className="relative p-2 text-content-muted hover:text-white transition-colors hover:bg-white/5 rounded-xl">
            <Bell size={22} strokeWidth={1.5} />
            <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-galaxy-pink shadow-[0_0_12px_rgba(219,39,119,0.9)] border border-background" />
          </button>
          
          <button className="relative p-2 text-content-muted hover:text-white transition-colors hover:bg-white/5 rounded-xl">
            <Settings2 size={22} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </header>
  );
}
