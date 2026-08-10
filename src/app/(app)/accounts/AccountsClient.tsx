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
import { CurrencyInput } from '../../../components/ui/form/CurrencyInput';
import { createBrowserClient } from '@supabase/ssr';

const schema = z.object({
  name: z.string().min(1, 'Tên không được để trống'),
  currency_code: z.string().default('VND'),
  balance: z.number().default(0),
});

export function AccountsClient({ initialData }: { initialData: any[] }) {
  const router = useRouter();
  const [data, setData] = React.useState(initialData);

  const supabase = React.useMemo(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ), []);

  React.useEffect(() => {
    const channel = supabase.channel('realtime:accounts')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'financial_accounts' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setData((prev) => [payload.new, ...prev]);
          } else if (payload.eventType === 'DELETE') {
            setData((prev) => prev.filter(item => item.id !== payload.old.id));
          } else if (payload.eventType === 'UPDATE') {
            setData((prev) => prev.map(item => item.id === payload.new.id ? payload.new : item));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const [isDrawerOpen, setDrawerOpen] = React.useState(false);
  const [deleteItem, setDeleteItem] = React.useState<any>(null);

  const { register, control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: '', currency_code: 'VND', balance: 0 }
  });

  const onSubmit = async (vals: any) => {
    try {
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
    } catch (e: any) {
      toast.error('Có lỗi xảy ra: Không thể kết nối tới máy chủ hoặc dữ liệu không hợp lệ. Vui lòng thử lại.');
      console.error(e);
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
    { key: 'currency_code', header: 'Tiền tệ', render: (i: any) => i.currency_code },
    { key: 'balance', header: 'Số dư', render: (i: any) => formatCurrency(Number(i.balance || 0)) },
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
          
          <CurrencyInput name="balance" control={control} label="Số dư ban đầu" placeholder="0" error={errors.balance?.message as string} />
          
          <button type="submit" disabled={isSubmitting} className="w-full bg-aurora-cyan text-black font-semibold rounded-lg p-3 hover:bg-aurora-cyan/90 transition-colors mt-4">Lưu tài khoản</button>
        </form>
      </FormDrawer>
      <ConfirmationDialog open={!!deleteItem} onOpenChange={(o) => !o && setDeleteItem(null)} title="Xác nhận xóa" description="Bạn có chắc chắn muốn xóa không?" onConfirm={handleConfirmDelete} isDestructive />
    </div>
  );
}