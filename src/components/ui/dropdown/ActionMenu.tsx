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
