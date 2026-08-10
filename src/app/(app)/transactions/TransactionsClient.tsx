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
import { createTransaction, updateTransaction, deleteTransaction, archiveTransaction, restoreTransaction } from '../../actions/transactions';
import { Typography } from '../../../components/ui/typography/Typography';
import { useRouter } from 'next/navigation';

import { CurrencyInput } from '../../../components/ui/form/CurrencyInput';

const schema = z.object({
  description: z.string().min(1, 'Mô tả không được để trống'),
  amount: z.number().min(1, 'Số tiền phải lớn hơn 0'),
  account_id: z.string().min(1, 'Vui lòng chọn tài khoản'),
  category_id: z.string().min(1, 'Vui lòng chọn danh mục'),
  date: z.string().min(1, 'Vui lòng chọn ngày'),
  currency: z.string().default('VND'),
  reference: z.string().optional(),
});

export function TransactionsClient({ initialData, accounts, categories }: { initialData: any[], accounts: any[], categories: any[] }) {
  const router = useRouter();
  const [data, setData] = React.useState(initialData);
  const [isDrawerOpen, setDrawerOpen] = React.useState(false);
  const [deleteItem, setDeleteItem] = React.useState<any>(null);

  const { register, control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { description: '', amount: 0, account_id: '', category_id: '', date: new Date().toISOString().split('T')[0], currency: 'VND', reference: '' }
  });

  const onSubmit = async (vals: any) => {
    const res = await createTransaction(vals);
    if (res.ok) {
      toast.success('Giao dịch đã được tạo');
      setDrawerOpen(false);
      reset();
      router.refresh(); // Triggers Dashboard revalidation
      setData([res.data, ...data]);
    } else {
      toast.error('Có lỗi xảy ra: ' + res.error);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteItem) return;
    const previous = [...data];
    setData(data.filter(d => d.id !== deleteItem.id));
    const res = await deleteTransaction(deleteItem.id);
    if (res.ok) {
      toast.success('Đã xóa giao dịch', {
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
    { key: 'date', header: 'Ngày', render: (i: any) => i.date },
    { key: 'description', header: 'Mô tả', render: (i: any) => <Typography variant="body" className="font-semibold">{i.description}</Typography> },
    { key: 'amount', header: 'Số tiền', render: (i: any) => formatCurrency(Number(i.amount || 0)/100) },
    { key: 'status', header: 'Trạng thái', render: (i: any) => <span className="text-aurora-cyan uppercase text-xs font-bold">{i.status}</span> },
    { key: 'actions', header: '', render: (i: any) => <ActionMenu onEdit={() => toast.info('Sắp ra mắt')} onDuplicate={() => toast.info('Đã nhân bản')} onArchive={() => archiveTransaction(i.id).then(() => { toast.success('Đã lưu trữ'); router.refresh(); })} onDelete={() => setDeleteItem(i)} /> }
  ];

  return (
    <div className="h-[600px] relative">
      {data.length === 0 ? (
        <EmptyState title="Chưa có giao dịch" description="Ghi lại giao dịch đầu tiên." actionLabel="Thêm giao dịch" onAction={() => setDrawerOpen(true)} />
      ) : (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => setDrawerOpen(true)} className="bg-white text-black px-4 py-2 rounded-lg font-semibold text-sm hover:scale-105 active:scale-95 transition-all">+ Tạo mới</button>
          </div>
          <DataTable data={data} columns={columns} emptyStateMessage="Không có dữ liệu" />
        </div>
      )}
      <FormDrawer open={isDrawerOpen} onOpenChange={setDrawerOpen} title="Tạo giao dịch" description="Nhập thông tin giao dịch.">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div><label className="block text-xs font-medium text-content-secondary mb-1">Ngày</label><input type="date" {...register('date')} className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white outline-none" />{errors.date && <span className="text-galaxy-red text-xs">{errors.date.message as string}</span>}</div>
          <div><label className="block text-xs font-medium text-content-secondary mb-1">Mô tả</label><input {...register('description')} className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white outline-none" />{errors.description && <span className="text-galaxy-red text-xs">{errors.description.message as string}</span>}</div>
          
          <CurrencyInput name="amount" control={control} label="Số tiền" placeholder="1,000,000" error={errors.amount?.message as string} />
          
          <div>
            <label className="block text-xs font-medium text-content-secondary mb-1">Tài khoản</label>
            <select {...register('account_id')} className="w-full bg-black border border-white/10 rounded-lg p-2.5 text-white outline-none">
              <option value="">Chọn tài khoản</option>
              {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
            {errors.account_id && <span className="text-galaxy-red text-xs">{errors.account_id.message as string}</span>}
          </div>

          <div>
            <label className="block text-xs font-medium text-content-secondary mb-1">Danh mục</label>
            <select {...register('category_id')} className="w-full bg-black border border-white/10 rounded-lg p-2.5 text-white outline-none">
              <option value="">Chọn danh mục</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            {errors.category_id && <span className="text-galaxy-red text-xs">{errors.category_id.message as string}</span>}
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full bg-aurora-cyan text-black font-semibold rounded-lg p-3 hover:bg-aurora-cyan/90 transition-colors mt-6">Lưu giao dịch</button>
        </form>
      </FormDrawer>
      <ConfirmationDialog open={!!deleteItem} onOpenChange={(o) => !o && setDeleteItem(null)} title="Xác nhận xóa" description="Bạn có chắc chắn muốn xóa không?" onConfirm={handleConfirmDelete} isDestructive />
    </div>
  );
}
