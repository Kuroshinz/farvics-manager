'use client';
import * as React from 'react';
import { Search, Bell, Command } from 'lucide-react';
import { motion } from 'framer-motion';

export function Topbar({ onOpenCommandPalette }: { onOpenCommandPalette: () => void }) {
  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-x-4 border-b border-white/5 bg-surface/30 px-4 backdrop-blur-2xl shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1 items-center">
          <button
            onClick={onOpenCommandPalette}
            className="flex w-full max-w-md items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-content-secondary transition-colors hover:bg-white/10 hover:text-white hover:border-white/20"
          >
            <Search size={16} />
            <span className="flex-1 text-left">Search or type a command...</span>
            <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-white/10 bg-surface px-1.5 font-mono text-[10px] font-medium text-content-muted">
              <Command size={10} /> K
            </kbd>
          </button>
        </div>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <button className="relative p-2 text-content-secondary hover:text-white transition-colors">
            <Bell size={20} />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-galaxy-red shadow-[0_0_8px_rgba(225,29,72,0.8)]" />
          </button>
        </div>
      </div>
    </header>
  );
}
