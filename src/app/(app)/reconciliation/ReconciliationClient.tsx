
'use client';
import * as React from 'react';
import { DataTable } from '../../../components/ui/data-table/DataTable';
import { EmptyState } from '../../../components/ui/empty-state/EmptyState';
import { ActionMenu } from '../../../components/ui/dropdown/ActionMenu';
import { ConfirmationDialog } from '../../../components/ui/dialog/ConfirmationDialog';
import { FormDrawer } from '../../../components/ui/drawer/FormDrawer';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { createReconciliation, updateReconciliation, deleteReconciliation } from '../../actions/reconciliation';
import { Typography } from '../../../components/ui/typography/Typography';
import { useRouter } from 'next/navigation';

const schema = z.object({ id: z.string().optional() });

export function ReconciliationClient({ initialData }: { initialData: any[] }) {
  const router = useRouter();
  const [data, setData] = React.useState(initialData);
  const [isDrawerOpen, setDrawerOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<any>(null);
  const [deleteItem, setDeleteItem] = React.useState<any>(null);

  const { register, handleSubmit, reset, setValue, formState: { isSubmitting } } = useForm({ resolver: zodResolver(schema) });

  React.useEffect(() => {
    if (editingItem) {
      Object.keys(editingItem).forEach(k => setValue(k as any, editingItem[k]));
    } else {
      reset();
    }
  }, [editingItem, setValue, reset]);

  const onSubmit = async (vals: any) => {
    const res = editingItem ? await updateReconciliation(editingItem.id, vals) : await createReconciliation(vals);
    if (res.ok) {
      toast.success('Thành công');
      setDrawerOpen(false);
      setEditingItem(null);
      reset();
      router.refresh();
      if (!editingItem) setData([{ ...vals, id: crypto.randomUUID() }, ...data]);
      else setData(data.map(d => d.id === editingItem.id ? { ...d, ...vals } : d));
    } else {
      toast.error('Lỗi');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteItem) return;
    const previous = [...data];
    setData(data.filter(d => d.id !== deleteItem.id));
    const res = await deleteReconciliation(deleteItem.id);
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
    { key: 'id', header: 'ID', render: (i: any) => i.id },
    { key: 'actions', header: '', render: (i: any) => <ActionMenu onEdit={() => { setEditingItem(i); setDrawerOpen(true); }} onDelete={() => setDeleteItem(i)} /> }
  ];

  return (
    <div className="h-[600px] relative">
      {data.length === 0 ? (
        <EmptyState title="Không có dữ liệu" description="Tạo bản ghi đầu tiên." actionLabel="Tạo mới" onAction={() => setDrawerOpen(true)} />
      ) : (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => { setEditingItem(null); setDrawerOpen(true); }} className="bg-white text-black px-4 py-2 rounded-lg font-semibold text-sm">+ Tạo mới</button>
          </div>
          <DataTable data={data} columns={columns} emptyStateMessage="Không có dữ liệu" />
        </div>
      )}
      <FormDrawer open={isDrawerOpen} onOpenChange={(o) => { setDrawerOpen(o); if (!o) setEditingItem(null); }} title={editingItem ? 'Chỉnh sửa' : 'Tạo mới'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <button type="submit" disabled={isSubmitting} className="w-full bg-aurora-cyan text-black font-semibold rounded-lg p-3">Lưu</button>
        </form>
      </FormDrawer>
      <ConfirmationDialog open={!!deleteItem} onOpenChange={(o) => !o && setDeleteItem(null)} title="Xác nhận xóa" description="Bạn có chắc chắn?" onConfirm={handleConfirmDelete} isDestructive />
    </div>
  );
}