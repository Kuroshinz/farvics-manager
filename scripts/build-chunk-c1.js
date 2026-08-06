const fs = require('fs');
const path = require('path');

// 1. Upgrade GlassPanel
const glassPath = 'd:\\ManagerMn\\src\\components\\ui\\glass-panel\\GlassPanel.tsx';
const glassContent = `
import * as React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface GlassPanelProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'intense' | 'subtle';
  interactive?: boolean;
}

export const GlassPanel = React.forwardRef<HTMLDivElement, GlassPanelProps>(
  ({ children, className = '', variant = 'default', interactive = false, ...props }, ref) => {
    
    let variantStyles = '';
    switch (variant) {
      case 'intense':
        variantStyles = 'bg-white/10 border-white/20 backdrop-blur-3xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_40px_rgba(255,255,255,0.1)]';
        break;
      case 'subtle':
        variantStyles = 'bg-black/20 border-white/5 backdrop-blur-xl';
        break;
      default:
        variantStyles = 'bg-white/[0.03] border-white/10 backdrop-blur-2xl shadow-[0_4px_24px_rgba(0,0,0,0.2)]';
    }

    const interactiveStyles = interactive 
      ? 'hover:bg-white/[0.08] hover:border-white/20 cursor-pointer transition-all duration-300' 
      : '';

    return (
      <motion.div
        ref={ref}
        className={\`relative rounded-3xl border overflow-hidden \${variantStyles} \${interactiveStyles} \${className}\`}
        initial={interactive ? { scale: 1 } : undefined}
        whileHover={interactive ? { scale: 1.01, y: -2 } : undefined}
        whileTap={interactive ? { scale: 0.98 } : undefined}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        {...props}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50 pointer-events-none" />
        {children}
      </motion.div>
    );
  }
);

GlassPanel.displayName = 'GlassPanel';
`;
fs.writeFileSync(glassPath, glassContent);

// 2. Upgrade AppShell with Mobile Drawer
const appShellPath = 'd:\\ManagerMn\\src\\components\\layouts\\AppShell\\AppShell.tsx';
const appShellContent = `
'use client';
import * as React from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <div className="flex h-screen w-full bg-surface text-content-primary overflow-hidden selection:bg-aurora-cyan/30">
      
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[998] md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-[999] w-[280px] shadow-2xl md:hidden"
            >
              <div className="absolute top-4 right-4 z-[1000] md:hidden">
                 <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-black/40 rounded-full border border-white/10 text-white backdrop-blur-md">
                   <X size={20} />
                 </button>
              </div>
              <Sidebar />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden relative">
        {/* Animated Background Orbs */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-galaxy-purple/20 rounded-full blur-[120px] pointer-events-none -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-aurora-blue/10 rounded-full blur-[150px] pointer-events-none translate-y-1/3" />
        
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-white/5 bg-surface/50 backdrop-blur-xl z-50">
           <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 bg-white/5 rounded-xl border border-white/10 text-white">
             <Menu size={24} />
           </button>
           <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-aurora-cyan to-galaxy-pink">FARVICS</span>
           <div className="w-10"></div> {/* Spacer for centering */}
        </div>

        <Topbar />
        
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 z-10 scroll-smooth">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
`;
fs.writeFileSync(appShellPath, appShellContent);

