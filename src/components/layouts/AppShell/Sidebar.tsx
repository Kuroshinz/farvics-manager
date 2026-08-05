'use client';
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, PieChart, Wallet, Target, Settings, AlignLeft, Activity } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { Typography } from '../../ui/typography/Typography';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const NAV_ITEMS = [
  { icon: Home, label: 'Dashboard', href: '/' },
  { icon: Wallet, label: 'Financials', href: '/financial' },
  { icon: PieChart, label: 'Reporting', href: '/reports' },
  { icon: Target, label: 'Objectives', href: '/goals' },
  { icon: Activity, label: 'Analytics', href: '/analytics' },
];

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 88 : 280 }}
      transition={{ type: 'spring', stiffness: 350, damping: 35 }}
      className="relative z-20 flex h-full flex-col bg-transparent md:bg-transparent"
    >
      <div className="flex h-24 items-center justify-between px-6">
        <AnimatePresence mode="wait">
          {!collapsed ? (
            <motion.div 
              key="full"
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: -10, transition: { duration: 0.1 } }}
              className="flex items-center gap-3 overflow-hidden cursor-pointer group"
            >
              <div className="h-10 w-10 rounded-2xl bg-gradient-galaxy shadow-[0_0_20px_rgba(219,39,119,0.3)] flex items-center justify-center relative overflow-hidden group-hover:shadow-[0_0_30px_rgba(219,39,119,0.6)] transition-shadow duration-500">
                 <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                 <span className="text-white font-bold text-lg tracking-tighter relative z-10">F</span>
              </div>
              <div className="flex flex-col">
                 <Typography variant="h3" className="text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                   Farvics
                 </Typography>
                 <span className="text-[10px] font-medium tracking-widest text-aurora-cyan uppercase opacity-80">Manager</span>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="icon"
              initial={{ opacity: 0, scale: 0.8 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.1 } }}
              className="mx-auto h-10 w-10 rounded-2xl bg-gradient-galaxy shadow-[0_0_20px_rgba(219,39,119,0.3)] flex items-center justify-center cursor-pointer"
              onClick={onToggle}
            >
               <span className="text-white font-bold text-lg tracking-tighter">F</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <nav className="flex-1 space-y-2 px-4 py-6">
        {NAV_ITEMS.map((item, i) => (
          <a
            key={i}
            href={item.href}
            className={cn(
              "group relative flex items-center rounded-2xl px-4 py-3 text-content-secondary transition-all duration-300",
              "hover:text-white"
            )}
          >
            <item.icon size={22} className="shrink-0 relative z-10 drop-shadow-md transition-transform group-hover:scale-110 group-hover:text-white duration-300" strokeWidth={1.5} />
            <AnimatePresence>
              {!collapsed && (
                <motion.span 
                  initial={{ opacity: 0, filter: 'blur(4px)', x: -10 }} 
                  animate={{ opacity: 1, filter: 'blur(0px)', x: 0 }} 
                  exit={{ opacity: 0, filter: 'blur(4px)', x: -10 }}
                  className="ml-4 text-[15px] font-medium tracking-wide relative z-10"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
            {/* Extremely soft internal glass hover effect */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity bg-white/[0.04] border border-white/[0.05] pointer-events-none scale-95 group-hover:scale-100 duration-300 ease-out shadow-[inset_0_0_12px_rgba(255,255,255,0.02)]" />
          </a>
        ))}
      </nav>

      {/* Action Area & Profile */}
      <div className="p-4 mt-auto space-y-4">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-content-secondary hover:text-white hover:bg-white/5 transition-colors border border-transparent hover:border-white/5"
        >
          <AlignLeft size={20} strokeWidth={1.5} className={cn("transition-transform duration-500", collapsed && "rotate-180")} />
          {!collapsed && <span className="text-sm font-medium">Collapse</span>}
        </button>

        <div className={cn("flex items-center gap-3 rounded-2xl p-2 transition-colors hover:bg-white/5 cursor-pointer border border-transparent hover:border-white/5", collapsed && "justify-center")}>
          <div className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-aurora-cyan to-galaxy-purple p-[2px] shadow-lg">
            <div className="h-full w-full rounded-full bg-background flex items-center justify-center">
              <span className="text-xs font-bold text-white tracking-wider">AD</span>
            </div>
          </div>
          {!collapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="truncate text-sm font-semibold text-white">Administrator</span>
              <span className="truncate text-[11px] font-medium text-content-muted">Farvics HQ</span>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
