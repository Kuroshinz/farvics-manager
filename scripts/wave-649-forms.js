const fs = require('fs');
const path = require('path');
function ensureDir(filePath) { const d = path.dirname(filePath); if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); }
function writeFile(filePath, content) { ensureDir(filePath); fs.writeFileSync(filePath, content.trim() + '\\n', 'utf8'); console.log(\`[CREATED] \${filePath}\`); }
const root = path.join(__dirname, '..');

// 4. FORM DRAWER (Radix Dialog as a side drawer)
writeFile(path.join(root, 'src/components/ui/drawer/FormDrawer.tsx'), \`
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
\`);

// Create Accounts Drawer Form Wrapper
writeFile(path.join(root, 'src/app/(app)/accounts/AccountsClient.tsx'), \`
'use client';
import * as React from 'react';
import { DataTable } from '../../../components/ui/data-table/DataTable';
import { EmptyState } from '../../../components/ui/empty-state/EmptyState';
import { translate } from '../../../shared/i18n/server'; // Will run client side fallback
import { formatCurrency } from '../../../shared/i18n/formatters';
import { ActionMenu } from '../../../components/ui/dropdown/ActionMenu';
import { ConfirmationDialog } from '../../../components/ui/dialog/ConfirmationDialog';
import { FormDrawer } from '../../../components/ui/drawer/FormDrawer';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { createAccount, deleteAccount } from '../../actions/accounts';
import { Typography } from '../../../components/ui/typography/Typography';
import { useRouter } from 'next/navigation';

const schema = z.object({
  name: z.string().min(1, 'Tên không được để trống'),
  currency_code: z.string().default('VND'),
  balance: z.number().default(0),
});

export function AccountsClient({ initialData }: { initialData: any[] }) {
  const router = useRouter();
  const [data, setData] = React.useState(initialData);
  const [isDrawerOpen, setDrawerOpen] = React.useState(false);
  const [deleteItem, setDeleteItem] = React.useState<any>(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: '', currency_code: 'VND', balance: 0 }
  });

  const onSubmit = async (vals: any) => {
    const res = await createAccount(vals);
    if (res.ok) {
      toast.success('Tài khoản đã được tạo');
      setDrawerOpen(false);
      reset();
      router.refresh();
      setData([res.data, ...data]); // Optimistic
    } else {
      toast.error('Có lỗi xảy ra: ' + res.error);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteItem) return;
    const previous = [...data];
    setData(data.filter(d => d.id !== deleteItem.id)); // Optimistic delete
    const res = await deleteAccount(deleteItem.id);
    if (res.ok) {
      toast.success('Đã xóa tài khoản', {
        action: { label: 'Hoàn tác', onClick: () => setData(previous) } // Mock undo fallback
      });
      router.refresh();
    } else {
      setData(previous);
      toast.error('Lỗi khi xóa: ' + res.error);
    }
    setDeleteItem(null);
  };

  const columns = [
    { key: 'name', header: 'Tên', render: (i: any) => <Typography variant="body" className="font-semibold">{i.name}</Typography> },
    { key: 'currency_code', header: 'Tiền tệ' },
    { key: 'balance', header: 'Số dư', render: (i: any) => formatCurrency(Number(i.balance || 0)/100) },
    { key: 'status', header: 'Trạng thái', render: (i: any) => <span className="text-aurora-green uppercase text-xs font-bold">{i.status}</span> },
    { key: 'actions', header: '', render: (i: any) => <ActionMenu onEdit={() => toast.info('Sắp ra mắt')} onDuplicate={() => toast.info('Sắp ra mắt')} onArchive={() => toast.info('Sắp ra mắt')} onDelete={() => setDeleteItem(i)} /> }
  ];

  return (
    <div className="h-[600px] relative">
      {data.length === 0 ? (
        <EmptyState 
          title="Chưa có tài khoản nào" 
          description="Tạo tài khoản đầu tiên để bắt đầu theo dõi số dư." 
          actionLabel="Tạo tài khoản" 
          onAction={() => setDrawerOpen(true)} 
        />
      ) : (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => setDrawerOpen(true)} className="bg-white text-black px-4 py-2 rounded-lg font-semibold text-sm hover:scale-105 active:scale-95 transition-all">+ Tạo mới</button>
          </div>
          <DataTable data={data} columns={columns} emptyStateMessage="Không có dữ liệu" />
        </div>
      )}

      <FormDrawer open={isDrawerOpen} onOpenChange={setDrawerOpen} title="Tạo tài khoản mới" description="Nhập thông tin chi tiết cho tài khoản tài chính.">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-content-secondary mb-1">Tên tài khoản</label>
            <input {...register('name')} className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white focus:border-aurora-cyan outline-none transition-colors" />
            {errors.name && <span className="text-galaxy-red text-xs mt-1 block">{errors.name.message as string}</span>}
          </div>
          <div>
            <label className="block text-xs font-medium text-content-secondary mb-1">Tiền tệ</label>
            <input {...register('currency_code')} className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white focus:border-aurora-cyan outline-none transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-medium text-content-secondary mb-1">Số dư ban đầu</label>
            <input type="number" {...register('balance', { valueAsNumber: true })} className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white focus:border-aurora-cyan outline-none transition-colors" />
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full bg-aurora-cyan text-black font-semibold rounded-lg p-3 hover:bg-aurora-cyan/90 transition-colors mt-4">
            {isSubmitting ? 'Đang lưu...' : 'Lưu tài khoản'}
          </button>
        </form>
      </FormDrawer>

      <ConfirmationDialog 
        open={!!deleteItem} 
        onOpenChange={(o) => !o && setDeleteItem(null)} 
        title="Xác nhận xóa" 
        description={\`Bạn có chắc chắn muốn xóa tài khoản "\${deleteItem?.name}" không? Hành động này sẽ được ghi vào nhật ký kiểm toán.\`}
        onConfirm={handleConfirmDelete} 
        isDestructive 
      />
    </div>
  );
}
\`);
console.log('Form drawer setup complete.');
