'use client';
import * as React from 'react';
import { LayoutDashboard, ArrowRightLeft, BookOpen, PieChart, Users, Settings, ChevronRight, Wallet, Target } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { Typography } from '../../ui/typography/Typography';
import { motion, AnimatePresence } from 'framer-motion';
import { WorkspaceSwitcher } from '../../features/workspace-switcher/WorkspaceSwitcher';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from '../../../providers/I18nProvider';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { icon: LayoutDashboard, label: 'nav.overview', href: '/' },
  { icon: Wallet, label: 'nav.accounts', href: '/accounts' },
  { icon: ArrowRightLeft, label: 'nav.transactions', href: '/transactions' },
  { icon: BookOpen, label: 'nav.journals', href: '/journals' },
  { icon: PieChart, label: 'nav.budgets', href: '/budgets' },
  { icon: Target, label: 'nav.goals', href: '/goals' },
];

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { t } = useTranslation();
  const pathname = usePathname();
  
  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 280 }}
      className="hidden md:flex flex-col h-[calc(100vh-2rem)] rounded-3xl border border-white/5 bg-surface/40 backdrop-blur-3xl shadow-[0_0_80px_rgba(0,0,0,0.3)] z-40 my-4 ml-4"
    >
      <div className="flex h-24 shrink-0 items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-galaxy shadow-lg ring-1 ring-white/20">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="overflow-hidden"
              >
                <Typography variant="h3" className="whitespace-nowrap tracking-wider">FARVICS</Typography>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      <div className="px-4 pt-4">
        <WorkspaceSwitcher collapsed={collapsed} />
      </div>
      
      <nav className="flex-1 space-y-2 px-4 py-6 overflow-y-auto hide-scrollbar">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={t(item.label)} href={item.href}>
              <div
                className={cn(
                  "group flex items-center gap-3 rounded-2xl px-3 py-3 transition-all cursor-pointer relative",
                  isActive
                    ? "bg-white/10 text-white shadow-inner"
                    : "text-content-secondary hover:bg-white/[0.04] hover:text-white"
                )}
                title={collapsed ? item.label : undefined}
              >
                {isActive && (
                  <motion.div layoutId="activeNav" className="absolute inset-0 rounded-2xl bg-white/5 border border-white/10" transition={{ type: "spring", stiffness: 300, damping: 30 }} />
                )}
                <div className="relative z-10 flex items-center gap-3 w-full">
                  <div className={cn("transition-colors", isActive ? "text-aurora-cyan" : "text-content-muted group-hover:text-white")}>
                     <item.icon size={18} strokeWidth={1.5} />
                  </div>
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="whitespace-nowrap font-medium text-sm tracking-wide"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-white/5 mt-auto">
        {/* User Profile Block */}
      </div>
    </motion.aside>
  );
}
