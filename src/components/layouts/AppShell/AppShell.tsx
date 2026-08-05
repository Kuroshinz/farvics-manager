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
    <div className="relative flex h-screen w-screen overflow-hidden bg-background text-content-primary md:p-4 md:gap-4">
      {/* Immersive Deep Space Ambient Lighting */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-galaxy-purple/10 rounded-full blur-[160px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[60%] bg-aurora-blue/10 rounded-full blur-[160px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      {!isMobile && (
        <Sidebar collapsed={isSidebarCollapsed} onToggle={() => setSidebarCollapsed(!isSidebarCollapsed)} />
      )}

      {/* Main Content Area - Floats as a distinct glass panel instead of generic edge-to-edge */}
      <div className="relative z-10 flex flex-1 flex-col overflow-hidden bg-surface/40 backdrop-blur-3xl md:rounded-[2rem] border-x border-t border-white/[0.03] shadow-[0_0_80px_rgba(0,0,0,0.5)]">
        {/* Subtle top inner highlight for 3D depth */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent z-20 pointer-events-none" />
        
        <Topbar onOpenCommandPalette={() => setCommandPaletteOpen(true)} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden hide-scrollbar scroll-smooth p-6 md:p-10 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.98, filter: 'blur(8px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
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
