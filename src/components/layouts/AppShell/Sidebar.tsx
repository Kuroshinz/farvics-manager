'use client';
import * as React from 'react';
import { motion } from 'framer-motion';
import { Home, PieChart, Wallet, Target, Settings, ChevronLeft, ChevronRight, Activity } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { Typography } from '../../ui/typography/Typography';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const NAV_ITEMS = [
  { icon: Home, label: 'Dashboard', href: '/' },
  { icon: Wallet, label: 'Financial', href: '/financial' },
  { icon: PieChart, label: 'Reports', href: '/reports' },
  { icon: Target, label: 'Goals', href: '/goals' },
  { icon: Activity, label: 'Analytics', href: '/analytics' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 280 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="relative z-20 flex h-full flex-col border-r border-white/5 bg-surface/30 backdrop-blur-2xl"
    >
      <div className="flex h-16 items-center justify-between px-4">
        {!collapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 overflow-hidden">
            <div className="h-8 w-8 rounded-xl bg-gradient-galaxy shadow-[0_0_15px_rgba(219,39,119,0.5)] flex items-center justify-center">
               <span className="text-white font-bold tracking-tighter">F</span>
            </div>
            <Typography variant="h3" className="text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
              Farvics
            </Typography>
          </motion.div>
        )}
        {collapsed && (
          <div className="mx-auto h-8 w-8 rounded-xl bg-gradient-galaxy shadow-[0_0_15px_rgba(219,39,119,0.5)] flex items-center justify-center">
             <span className="text-white font-bold tracking-tighter">F</span>
          </div>
        )}
      </div>

      <button
        onClick={onToggle}
        className="absolute -right-3 top-6 flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-surface text-content-secondary hover:text-white hover:border-white/20 transition-all z-50 shadow-lg"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <nav className="flex-1 space-y-2 px-3 py-4">
        {NAV_ITEMS.map((item, i) => (
          <a
            key={i}
            href={item.href}
            className="group relative flex items-center rounded-xl px-3 py-2.5 text-content-secondary transition-all hover:bg-white/5 hover:text-white"
          >
            <item.icon size={20} className="shrink-0" />
            {!collapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="ml-3 text-sm font-medium">
                {item.label}
              </motion.span>
            )}
            {/* Hover Glow effect */}
            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-white/5 to-transparent pointer-events-none" />
          </a>
        ))}
      </nav>

      {/* Bottom User Profile */}
      <div className="p-4 mt-auto border-t border-white/5">
        <div className={cn("flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-white/5", collapsed && "justify-center")}>
          <div className="h-9 w-9 shrink-0 rounded-full bg-gradient-to-br from-aurora-blue to-galaxy-purple p-[2px]">
            <div className="h-full w-full rounded-full border border-black/50 bg-surface flex items-center justify-center">
              <span className="text-xs font-bold text-white">US</span>
            </div>
          </div>
          {!collapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="truncate text-sm font-medium text-white">Admin User</span>
              <span className="truncate text-xs text-content-secondary">admin@farvics.com</span>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
