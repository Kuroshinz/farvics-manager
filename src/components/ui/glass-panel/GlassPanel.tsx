'use client';

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
        className={`relative rounded-3xl border overflow-hidden ${variantStyles} ${interactiveStyles} ${className}`}
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

