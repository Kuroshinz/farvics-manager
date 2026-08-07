const fs = require('fs');
const path = require('path');

function ensureDir(filePath) {
  const dirname = path.dirname(filePath);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }
}

function writeFile(filePath, content) {
  ensureDir(filePath);
  fs.writeFileSync(filePath, content.trim() + '\n', 'utf8');
  console.log(`[CREATED] ${filePath}`);
}

const root = path.join(__dirname, '..');

// 1. CONFIRMATION DIALOG (Radix + Glassmorphism + Focus Trap)
writeFile(path.join(root, 'src/components/ui/dialog/ConfirmationDialog.tsx'), `
'use client';
import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { Typography } from '../typography/Typography';
import { AlertTriangle, X } from 'lucide-react';

export function ConfirmationDialog({ open, onOpenChange, title, description, onConfirm, isDestructive = false }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
  isDestructive?: boolean;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
                exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                className="fixed inset-0 z-50 bg-black/40"
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/10 bg-black/60 p-6 shadow-[0_0_40px_rgba(0,0,0,0.5)] backdrop-blur-xl focus:outline-none"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.05] to-transparent pointer-events-none" />
                {isDestructive && <div className="absolute -top-10 -left-10 w-32 h-32 bg-galaxy-red/20 rounded-full blur-[40px] pointer-events-none" />}
                
                <div className="flex gap-4 relative z-10">
                  <div className={\`flex h-12 w-12 shrink-0 items-center justify-center rounded-full \${isDestructive ? 'bg-galaxy-red/10 text-galaxy-red' : 'bg-aurora-cyan/10 text-aurora-cyan'}\`}>
                    <AlertTriangle size={24} />
                  </div>
                  <div>
                    <Dialog.Title asChild><Typography variant="h3" className="mb-2">{title}</Typography></Dialog.Title>
                    <Dialog.Description asChild><Typography variant="body" className="text-content-secondary mb-6">{description}</Typography></Dialog.Description>
                    <div className="flex justify-end gap-3">
                      <Dialog.Close asChild>
                        <button className="px-4 py-2 rounded-lg text-sm font-semibold hover:bg-white/5 transition-colors text-white">Hủy (ESC)</button>
                      </Dialog.Close>
                      <button 
                        onClick={() => { onConfirm(); onOpenChange(false); }}
                        className={\`px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105 active:scale-95 \${isDestructive ? 'bg-galaxy-red text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]' : 'bg-aurora-cyan text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]'}\`}
                      >
                        Xác nhận (ENTER)
                      </button>
                    </div>
                  </div>
                </div>
                <Dialog.Close asChild>
                  <button className="absolute right-4 top-4 rounded-full p-1 opacity-70 hover:bg-white/10 hover:opacity-100 transition-all"><X size={16} /></button>
                </Dialog.Close>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
`);

// 2. ACTION MENU (DropdownMenu for Rows)
writeFile(path.join(root, 'src/components/ui/dropdown/ActionMenu.tsx'), `
'use client';
import * as React from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { MoreVertical, Edit2, Copy, Archive, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ActionMenu({ onEdit, onDuplicate, onArchive, onDelete }: any) {
  const [open, setOpen] = React.useState(false);
  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <button className="p-2 rounded-lg hover:bg-white/10 text-content-secondary hover:text-white transition-colors outline-none"><MoreVertical size={16} /></button>
      </DropdownMenu.Trigger>
      <AnimatePresence>
        {open && (
          <DropdownMenu.Portal forceMount>
            <DropdownMenu.Content asChild sideOffset={5} align="end">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -5 }}
                transition={{ duration: 0.15 }}
                className="z-50 min-w-[160px] rounded-xl border border-white/10 bg-black/80 p-1.5 shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl"
              >
                <DropdownMenu.Item onClick={onEdit} className="flex cursor-pointer select-none items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-white/90 outline-none focus:bg-white/10 hover:bg-white/10 transition-colors">
                  <Edit2 size={14} /> Chỉnh sửa
                </DropdownMenu.Item>
                <DropdownMenu.Item onClick={onDuplicate} className="flex cursor-pointer select-none items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-white/90 outline-none focus:bg-white/10 hover:bg-white/10 transition-colors">
                  <Copy size={14} /> Nhân bản
                </DropdownMenu.Item>
                <DropdownMenu.Separator className="my-1 h-px bg-white/10" />
                <DropdownMenu.Item onClick={onArchive} className="flex cursor-pointer select-none items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-white/90 outline-none focus:bg-white/10 hover:bg-white/10 transition-colors">
                  <Archive size={14} /> Lưu trữ
                </DropdownMenu.Item>
                <DropdownMenu.Item onClick={onDelete} className="flex cursor-pointer select-none items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-galaxy-red outline-none focus:bg-galaxy-red/10 hover:bg-galaxy-red/10 transition-colors">
                  <Trash2 size={14} /> Xóa
                </DropdownMenu.Item>
              </motion.div>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        )}
      </AnimatePresence>
    </DropdownMenu.Root>
  );
}
`);

// 3. ROOT LAYOUT: Add Toaster (Sonner)
const rootLayoutPath = path.join(root, 'src/app/layout.tsx');
if (fs.existsSync(rootLayoutPath)) {
  let layoutCode = fs.readFileSync(rootLayoutPath, 'utf8');
  if (!layoutCode.includes('<Toaster')) {
    layoutCode = layoutCode.replace(
      "import './globals.css';",
      "import './globals.css';\nimport { Toaster } from 'sonner';"
    );
    layoutCode = layoutCode.replace(
      "{children}",
      "{children}\n        <Toaster theme=\"dark\" toastOptions={{ className: 'bg-black/80 backdrop-blur-xl border border-white/10 text-white rounded-xl' }} />"
    );
    fs.writeFileSync(rootLayoutPath, layoutCode, 'utf8');
    console.log('[UPDATED] layout.tsx with Toaster');
  }
}

console.log('Premium Components Scaffolding Complete.');
