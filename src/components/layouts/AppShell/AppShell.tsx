'use client';
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { MobileNav } from './MobileNav';
import { CommandPalette } from '../../features/command-palette/CommandPalette';
import { useMediaQuery } from '../../../hooks';

export function AppShell({ children }: { children: React.ReactNode }) {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [isSidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [isCommandPaletteOpen, setCommandPaletteOpen] = React.useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative flex h-screen w-screen overflow-hidden bg-background text-content-primary">
      {/* Background Particles & Glows */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-galaxy-purple/15 rounded-full blur-[140px] animate-pulse-slow" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[50%] bg-aurora-cyan/10 rounded-full blur-[140px] animate-pulse-slow" style={{ animationDelay: '3s' }} />
        <div className="absolute top-[40%] left-[50%] w-[30%] h-[30%] bg-galaxy-pink/5 rounded-full blur-[120px]" />
      </div>

      {!isMobile && (
        <Sidebar collapsed={isSidebarCollapsed} onToggle={() => setSidebarCollapsed(!isSidebarCollapsed)} />
      )}

      <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
        <Topbar onOpenCommandPalette={() => setCommandPaletteOpen(true)} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden hide-scrollbar scroll-smooth p-4 md:p-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto max-w-7xl h-full"
          >
            {children}
          </motion.div>
        </main>
      </div>

      {isMobile && <MobileNav />}

      <AnimatePresence>
        {isCommandPaletteOpen && (
          <CommandPalette onClose={() => setCommandPaletteOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
