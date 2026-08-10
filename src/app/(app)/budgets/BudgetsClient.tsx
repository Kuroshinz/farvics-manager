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
import { createBudget, updateBudget, deleteBudget, archiveBudget, restoreBudget } from '../../actions/budgets';
import { Typography } from '../../../components/ui/typography/Typography';
import { useRouter } from 'next/navigation';
import { CurrencyInput } from '../../../components/ui/form/CurrencyInput';

const schema = z.object({
  name: z.string().min(1, 'Tên không được để trống'),
  limit_minor_units: z.number().min(1, 'Ngân sách phải lớn hơn 0'),
  account_id: z.string().min(1, 'Vui lòng chọn tài khoản'),
  category_id: z.string().min(1, 'Vui lòng chọn danh mục'),
  period_start: z.string().min(1, 'Vui lòng chọn ngày bắt đầu'),
  period_end: z.string().min(1, 'Vui lòng chọn ngày kết thúc'),
  currency_code: z.string().default('VND'),
  description: z.string().optional(),
}).refine(data => new Date(data.period_end) >= new Date(data.period_start), {
  message: 'Ngày kết thúc phải sau ngày bắt đầu',
  path: ['period_end']
});

export function BudgetsClient({ initialData, accounts, categories }: { initialData: any[], accounts: any[], categories: any[] }) {
  const router = useRouter();
  const [data, setData] = React.useState(initialData);
  const [isDrawerOpen, setDrawerOpen] = React.useState(false);
  const [deleteItem, setDeleteItem] = React.useState<any>(null);

  const { register, control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: '', limit_minor_units: 0, account_id: '', category_id: '', period_start: new Date().toISOString().split('T')[0], period_end: '', currency_code: 'VND', description: '' }
  });

  const onSubmit = async (vals: any) => {
    // Send limit_minor_units as the amount since createBudget expects it
    const res = await createBudget({ ...vals, limit_minor_units: vals.limit_minor_units * 100 });
    if (res.ok) {
      toast.success('Ngân sách đã được tạo');
      setDrawerOpen(false);
      reset();
      router.refresh();
      setData([res.data || { ...vals, id: crypto.randomUUID(), spent: 0, limit_minor_units: vals.limit_minor_units * 100 }, ...data]);
    } else {
      toast.error('Có lỗi xảy ra: ' + res.error);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteItem) return;
    const previous = [...data];
    setData(data.filter(d => d.id !== deleteItem.id));
    const res = await deleteBudget(deleteItem.id);
    if (res.ok) {
      toast.success('Đã xóa ngân sách', {
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
    { key: 'name', header: 'Tên ngân sách', render: (i: any) => <Typography variant="body" className="font-semibold">{i.name}</Typography> },
    { key: 'period', header: 'Thời gian', render: (i: any) => `${i.period_start?.split('T')[0] || ''} - ${i.period_end?.split('T')[0] || ''}` },
    { key: 'limit', header: 'Tổng ngân sách', render: (i: any) => formatCurrency(Number(i.limit_minor_units || 0)/100) },
    { key: 'spent', header: 'Đã chi', render: (i: any) => <span className="text-galaxy-red">{formatCurrency(Number(i.spent || 0)/100)}</span> },
    { key: 'remaining', header: 'Còn lại', render: (i: any) => <span className="text-aurora-green">{formatCurrency(Math.max(0, (Number(i.limit_minor_units || 0) - Number(i.spent || 0)))/100)}</span> },
    { key: 'status', header: 'Trạng thái', render: (i: any) => <span className="text-aurora-cyan uppercase text-xs font-bold">{i.status || 'Active'}</span> },
    { key: 'actions', header: '', render: (i: any) => <ActionMenu onEdit={() => toast.info('Sắp ra mắt')} onDuplicate={() => toast.info('Đã nhân bản')} onArchive={() => archiveBudget(i.id).then(() => { toast.success('Đã lưu trữ'); router.refresh(); })} onDelete={() => setDeleteItem(i)} /> }
  ];

  return (
    <div className="h-[600px] relative">
      {data.length === 0 ? (
        <EmptyState title="Chưa có ngân sách" description="Lập ngân sách để quản lý chi tiêu." actionLabel="Tạo ngân sách" onAction={() => setDrawerOpen(true)} />
      ) : (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => setDrawerOpen(true)} className="bg-white text-black px-4 py-2 rounded-lg font-semibold text-sm hover:scale-105 active:scale-95 transition-all">+ Tạo mới</button>
          </div>
          <DataTable data={data} columns={columns} emptyStateMessage="Không có dữ liệu" />
        </div>
      )}
      <FormDrawer open={isDrawerOpen} onOpenChange={setDrawerOpen} title="Tạo ngân sách mới" description="Nhập thông tin ngân sách.">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div><label className="block text-xs font-medium text-content-secondary mb-1">Tên ngân sách</label><input {...register('name')} className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white outline-none" />{errors.name && <span className="text-galaxy-red text-xs">{errors.name.message as string}</span>}</div>
          
          <CurrencyInput name="limit_minor_units" control={control} label="Số tiền (VND)" placeholder="1,000,000" error={errors.limit_minor_units?.message as string} />
          
          <div className="flex gap-4">
            <div className="flex-1"><label className="block text-xs font-medium text-content-secondary mb-1">Từ ngày</label><input type="date" {...register('period_start')} className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white outline-none" />{errors.period_start && <span className="text-galaxy-red text-xs">{errors.period_start.message as string}</span>}</div>
            <div className="flex-1"><label className="block text-xs font-medium text-content-secondary mb-1">Đến ngày</label><input type="date" {...register('period_end')} className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white outline-none" />{errors.period_end && <span className="text-galaxy-red text-xs">{errors.period_end.message as string}</span>}</div>
          </div>

          <div>
            <label className="block text-xs font-medium text-content-secondary mb-1">Tài khoản áp dụng</label>
            <select {...register('account_id')} className="w-full bg-black border border-white/10 rounded-lg p-2.5 text-white outline-none">
              <option value="">Tất cả tài khoản</option>
              {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
            {errors.account_id && <span className="text-galaxy-red text-xs">{errors.account_id.message as string}</span>}
          </div>

          <div>
            <label className="block text-xs font-medium text-content-secondary mb-1">Danh mục áp dụng</label>
            <select {...register('category_id')} className="w-full bg-black border border-white/10 rounded-lg p-2.5 text-white outline-none">
              <option value="">Tất cả danh mục</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            {errors.category_id && <span className="text-galaxy-red text-xs">{errors.category_id.message as string}</span>}
          </div>

          <div><label className="block text-xs font-medium text-content-secondary mb-1">Ghi chú (Tùy chọn)</label><input {...register('description')} className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white outline-none" /></div>

          <button type="submit" disabled={isSubmitting} className="w-full bg-aurora-cyan text-black font-semibold rounded-lg p-3 hover:bg-aurora-cyan/90 transition-colors mt-6">Lưu ngân sách</button>
        </form>
      </FormDrawer>
      <ConfirmationDialog open={!!deleteItem} onOpenChange={(o) => !o && setDeleteItem(null)} title="Xác nhận xóa" description="Bạn có chắc chắn muốn xóa ngân sách này không?" onConfirm={handleConfirmDelete} isDestructive />
    </div>
  );
}
