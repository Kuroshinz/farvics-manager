'use client';
import * as React from 'react';
import { DataTable } from '../../../components/ui/data-table/DataTable';
import { EmptyState } from '../../../components/ui/empty-state/EmptyState';
import { formatCurrency } from '../../../shared/i18n/formatters';
import { ActionMenu } from '../../../components/ui/dropdown/ActionMenu';
import { ConfirmationDialog } from '../../../components/ui/dialog/ConfirmationDialog';
import { FormDrawer } from '../../../components/ui/drawer/FormDrawer';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { createAccount, deleteAccount, archiveAccount, restoreAccount } from '../../actions/accounts';
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
      setData([res.data, ...data]);
    } else {
      toast.error('Có lỗi xảy ra: ' + res.error);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteItem) return;
    const previous = [...data];
    setData(data.filter(d => d.id !== deleteItem.id));
    const res = await deleteAccount(deleteItem.id);
    if (res.ok) {
      toast.success('Đã xóa tài khoản', {
        action: { label: 'Hoàn tác', onClick: () => setData(previous) }
      });
      router.refresh();
    } else {
      setData(previous);
      toast.error('Lỗi khi xóa');
    }
    setDeleteItem(null);
  };

  const columns = [
    { key: 'name', header: 'Tên', render: (i: any) => <Typography variant="body" className="font-semibold">{i.name}</Typography> },
    { key: 'currency_code', header: 'Tiền tệ' },
    { key: 'balance', header: 'Số dư', render: (i: any) => formatCurrency(Number(i.balance || 0)/100) },
    { key: 'status', header: 'Trạng thái', render: (i: any) => <span className="text-aurora-green uppercase text-xs font-bold">{i.status}</span> },
    { key: 'actions', header: '', render: (i: any) => <ActionMenu onEdit={() => toast.info('Sắp ra mắt')} onDuplicate={() => toast.info('Đã nhân bản')} onArchive={() => toast.info('Đã lưu trữ')} onDelete={() => setDeleteItem(i)} /> }
  ];

  return (
    <div className="h-[600px] relative">
      {data.length === 0 ? (
        <EmptyState title="Chưa có tài khoản nào" description="Tạo tài khoản đầu tiên để bắt đầu." actionLabel="Tạo tài khoản" onAction={() => setDrawerOpen(true)} />
      ) : (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => setDrawerOpen(true)} className="bg-white text-black px-4 py-2 rounded-lg font-semibold text-sm hover:scale-105 active:scale-95 transition-all">+ Tạo mới</button>
          </div>
          <DataTable data={data} columns={columns} emptyStateMessage="Không có dữ liệu" />
        </div>
      )}
      <FormDrawer open={isDrawerOpen} onOpenChange={setDrawerOpen} title="Tạo tài khoản mới" description="Nhập thông tin tài khoản.">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div><label className="block text-xs font-medium text-content-secondary mb-1">Tên</label><input {...register('name')} className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white outline-none" /></div>
          <div><label className="block text-xs font-medium text-content-secondary mb-1">Tiền tệ</label><input {...register('currency_code')} className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white outline-none" /></div>
          <div><label className="block text-xs font-medium text-content-secondary mb-1">Số dư ban đầu</label><input type="number" {...register('balance', { valueAsNumber: true })} className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white outline-none" /></div>
          <button type="submit" disabled={isSubmitting} className="w-full bg-aurora-cyan text-black font-semibold rounded-lg p-3 hover:bg-aurora-cyan/90 transition-colors mt-4">Lưu tài khoản</button>
        </form>
      </FormDrawer>
      <ConfirmationDialog open={!!deleteItem} onOpenChange={(o) => !o && setDeleteItem(null)} title="Xác nhận xóa" description="Bạn có chắc chắn muốn xóa không?" onConfirm={handleConfirmDelete} isDestructive />
    </div>
  );
}