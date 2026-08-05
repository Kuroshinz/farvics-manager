'use client';
import * as React from 'react';
import { ChevronsUpDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function WorkspaceSwitcher({ collapsed }: { collapsed?: boolean }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const workspaces = ['Farvics HQ', 'Personal Portfolio', 'Acme Corp Sandbox'];
  const [active, setActive] = React.useState(workspaces[0]);

  return (
    <div className="relative w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-2 rounded-2xl border border-white/5 bg-white/[0.02] p-2 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-galaxy-purple to-galaxy-pink shadow-inner">
            <span className="text-xs font-bold text-white tracking-widest">{active.substring(0, 2).toUpperCase()}</span>
          </div>
          {!collapsed && (
            <span className="truncate text-sm font-semibold text-white">{active}</span>
          )}
        </div>
        {!collapsed && <ChevronsUpDown size={14} className="text-content-muted shrink-0 mr-1" />}
      </button>

      <AnimatePresence>
        {isOpen && !collapsed && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 w-full rounded-2xl border border-white/10 bg-surface/90 p-1 backdrop-blur-3xl shadow-[0_20px_40px_rgba(0,0,0,0.5)] z-[600]"
          >
            {workspaces.map((ws) => (
              <button
                key={ws}
                onClick={() => { setActive(ws); setIsOpen(false); }}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm text-content-secondary hover:bg-white/10 hover:text-white transition-colors"
              >
                <span className="truncate">{ws}</span>
                {active === ws && <Check size={14} className="text-aurora-cyan" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
