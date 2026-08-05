'use client';
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ContextMenuProps {
  children: React.ReactNode;
  menuContent: React.ReactNode;
}

export function ContextMenu({ children, menuContent }: ContextMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setPosition({ x: e.clientX, y: e.clientY });
    setIsOpen(true);
  };

  const closeMenu = () => setIsOpen(false);

  React.useEffect(() => {
    if (isOpen) {
      window.addEventListener('click', closeMenu);
      return () => window.removeEventListener('click', closeMenu);
    }
  }, [isOpen]);

  return (
    <>
      <div onContextMenu={handleContextMenu} className="inline-block w-full h-full">
        {children}
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="fixed z-[9999] min-w-[200px] overflow-hidden rounded-xl border border-white/10 bg-surface/90 p-1 backdrop-blur-3xl shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
            style={{ left: position.x, top: position.y }}
          >
            {menuContent}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
