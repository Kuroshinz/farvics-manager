'use client';
import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Typography } from '../typography/Typography';

export function FormDrawer({ open, onOpenChange, title, description, children }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                animate={{ opacity: 1, backdropFilter: "blur(4px)" }}
                exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                className="fixed inset-0 z-40 bg-black/40"
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md border-l border-white/10 bg-black/80 shadow-2xl backdrop-blur-3xl outline-none overflow-y-auto"
              >
                <div className="flex items-center justify-between border-b border-white/10 p-6 bg-white/[0.02]">
                  <div>
                    <Dialog.Title asChild><Typography variant="h3">{title}</Typography></Dialog.Title>
                    {description && <Dialog.Description asChild><Typography variant="caption" className="text-content-secondary mt-1 block">{description}</Typography></Dialog.Description>}
                  </div>
                  <Dialog.Close asChild>
                    <button className="rounded-full p-2 text-content-secondary hover:bg-white/10 hover:text-white transition-colors"><X size={20} /></button>
                  </Dialog.Close>
                </div>
                <div className="p-6">
                  {children}
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
