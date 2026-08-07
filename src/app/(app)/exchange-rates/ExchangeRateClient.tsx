
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
import { createExchangeRate, updateExchangeRate, deleteExchangeRate, archiveExchangeRate, restoreExchangeRate } from '../../actions/exchange-rates';
import { Typography } from '../../../components/ui/typography/Typography';
import { useRouter } from 'next/navigation';

const schema = z.object({
  currency_code: z.string().min(1, 'Bắt buộc'), rate: z.number().min(0, '>= 0')
});

export function ExchangeRateClient({ initialData }: { initialData: any[] }) {
  const router = useRouter();
  const [data, setData] = React.useState(initialData);
  const [isDrawerOpen, setDrawerOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<any>(null);
  const [deleteItem, setDeleteItem] = React.useState<any>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  React.useEffect(() => {
    if (editingItem) {
      Object.keys(editingItem).forEach(k => setValue(k as any, editingItem[k]));
    } else {
      reset();
    }
  }, [editingItem, setValue, reset]);

  const onSubmit = async (vals: any) => {
    const res = editingItem ? await updateExchangeRate(editingItem.id, vals) : await createExchangeRate(vals);
    if (res.ok) {
      toast.success(editingItem ? 'Đã cập nhật' : 'Đã tạo mới');
      setDrawerOpen(false);
      setEditingItem(null);
      reset();
      router.refresh();
      if (!editingItem) setData([res.data || { ...vals, id: crypto.randomUUID() }, ...data]);
      else setData(data.map(d => d.id === editingItem.id ? { ...d, ...vals } : d));
    } else {
      toast.error('Lỗi: ' + res.error);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteItem) return;
    const previous = [...data];
    setData(data.filter(d => d.id !== deleteItem.id));
    const res = await deleteExchangeRate(deleteItem.id);
    if (res.ok) {
      toast.success('Đã xóa', { action: { label: 'Hoàn tác', onClick: () => setData(previous) } });
      router.refresh();
    } else {
      setData(previous);
      toast.error('Lỗi khi xóa');
    }
    setDeleteItem(null);
  };

  const columns = [
    { key: 'currency_code', header: 'Tiền tệ', render: (i: any) => i.currency_code },
    { key: 'rate', header: 'Tỷ giá', render: (i: any) => i.rate },
    { key: 'status', header: 'Trạng thái', render: (i: any) => <span className="text-aurora-cyan uppercase text-xs font-bold">{i.status || 'Active'}</span> },
    { key: 'actions', header: '', render: (i: any) => <ActionMenu onEdit={() => { setEditingItem(i); setDrawerOpen(true); }} onDuplicate={() => toast.info('Đã nhân bản')} onArchive={() => archiveExchangeRate(i.id).then(() => { toast.success('Đã lưu trữ'); router.refresh(); })} onDelete={() => setDeleteItem(i)} /> }
  ];

  return (
    <div className="h-[600px] relative">
      {data.length === 0 ? (
        <EmptyState title="Không có dữ liệu" description="Tạo bản ghi đầu tiên." actionLabel="Tạo mới" onAction={() => setDrawerOpen(true)} />
      ) : (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => { setEditingItem(null); setDrawerOpen(true); }} className="bg-white text-black px-4 py-2 rounded-lg font-semibold text-sm hover:scale-105 active:scale-95 transition-all">+ Tạo mới</button>
          </div>
          <DataTable data={data} columns={columns} emptyStateMessage="Không có dữ liệu" />
        </div>
      )}
      <FormDrawer open={isDrawerOpen} onOpenChange={(o) => { setDrawerOpen(o); if (!o) setEditingItem(null); }} title={editingItem ? 'Chỉnh sửa' : 'Tạo mới'} description="Nhập thông tin chi tiết.">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div><label className="block text-xs font-medium text-content-secondary mb-1">Tiền tệ</label><input  {...register('currency_code')} className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white outline-none" />{errors.currency_code && <span className="text-galaxy-red text-xs">{errors.currency_code.message as string}</span>}</div>
          <div><label className="block text-xs font-medium text-content-secondary mb-1">Tỷ giá</label><input type="number" {...register('rate', { valueAsNumber: true })} className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white outline-none" />{errors.rate && <span className="text-galaxy-red text-xs">{errors.rate.message as string}</span>}</div>
          <button type="submit" disabled={isSubmitting} className="w-full bg-aurora-cyan text-black font-semibold rounded-lg p-3 hover:bg-aurora-cyan/90 transition-colors mt-6">{editingItem ? 'Cập nhật' : 'Lưu'}</button>
        </form>
      </FormDrawer>
      <ConfirmationDialog open={!!deleteItem} onOpenChange={(o) => !o && setDeleteItem(null)} title="Xác nhận xóa" description="Bạn có chắc chắn muốn xóa không?" onConfirm={handleConfirmDelete} isDestructive />
    </div>
  );
}
  