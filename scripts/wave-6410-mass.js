const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', 'src', 'app', '(app)');

function buildClient(name, route, fields, actions, schemaObj) {
  return `
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
import { create${name}, update${name}, delete${name}, archive${name}, restore${name} } from '../../actions/${actions}';
import { Typography } from '../../../components/ui/typography/Typography';
import { useRouter } from 'next/navigation';

const schema = z.object({
  ${schemaObj}
});

export function ${name}Client({ initialData }: { initialData: any[] }) {
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
      Object.keys(editingItem).forEach(k => setValue(k, editingItem[k]));
    } else {
      reset();
    }
  }, [editingItem, setValue, reset]);

  const onSubmit = async (vals: any) => {
    const res = editingItem ? await update${name}(editingItem.id, vals) : await create${name}(vals);
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
    const res = await delete${name}(deleteItem.id);
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
    ${fields.map(f => `{ key: '${f.key}', header: '${f.label}', render: (i: any) => ${f.format || 'i.' + f.key} }`).join(',\n    ')},
    { key: 'status', header: 'Trạng thái', render: (i: any) => <span className="text-aurora-cyan uppercase text-xs font-bold">{i.status || 'Active'}</span> },
    { key: 'actions', header: '', render: (i: any) => <ActionMenu onEdit={() => { setEditingItem(i); setDrawerOpen(true); }} onDuplicate={() => toast.info('Đã nhân bản')} onArchive={() => archive${name}(i.id).then(() => { toast.success('Đã lưu trữ'); router.refresh(); })} onDelete={() => setDeleteItem(i)} /> }
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
          ${fields.map(f => `<div><label className="block text-xs font-medium text-content-secondary mb-1">${f.label}</label><input ${f.type === 'number' ? 'type="number"' : ''} {...register('${f.key}'${f.type === 'number' ? ', { valueAsNumber: true }' : ''})} className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-white outline-none" />{errors.${f.key} && <span className="text-galaxy-red text-xs">{errors.${f.key}.message as string}</span>}</div>`).join('\n          ')}
          <button type="submit" disabled={isSubmitting} className="w-full bg-aurora-cyan text-black font-semibold rounded-lg p-3 hover:bg-aurora-cyan/90 transition-colors mt-6">{editingItem ? 'Cập nhật' : 'Lưu'}</button>
        </form>
      </FormDrawer>
      <ConfirmationDialog open={!!deleteItem} onOpenChange={(o) => !o && setDeleteItem(null)} title="Xác nhận xóa" description="Bạn có chắc chắn muốn xóa không?" onConfirm={handleConfirmDelete} isDestructive />
    </div>
  );
}
  `;
}

function buildPage(name, route, fetcher) {
  return `
import * as React from 'react';
import { Suspense } from 'react';
import { PageHeader } from '../../../components/layouts/AppShell/PageHeader';
import { ${fetcher} } from '../../actions/financial-queries';
import { translate } from '../../../shared/i18n/server';
import { ${name}Client } from './${name}Client';
import { TableSkeleton } from '../../../components/ui/skeleton/Skeleton';

async function DataContainer() {
  const data = await ${fetcher}();
  return <${name}Client initialData={data || []} />;
}

export default function Page() {
  return (
    <div className="space-y-6 md:space-y-8 h-full animate-fade-in pb-20">
      <PageHeader title={translate('page.${route}.title')} description={translate('page.${route}.desc')} breadcrumbs={[{ label: 'Farvics HQ' }, { label: 'Tài chính' }, { label: 'Chi tiết' }]} />
      <Suspense fallback={<TableSkeleton />}><DataContainer /></Suspense>
    </div>
  );
}
  `;
}

const modules = [
  {
    name: 'Category',
    route: 'categories',
    actions: 'categories',
    fetcher: 'fetchCategories',
    schemaObj: `name: z.string().min(1, 'Bắt buộc')`,
    fields: [{ key: 'name', type: 'text', label: 'Tên danh mục' }]
  },
  {
    name: 'Goal',
    route: 'goals',
    actions: 'goals',
    fetcher: 'fetchGoals',
    schemaObj: `name: z.string().min(1, 'Bắt buộc'), target_amount: z.number().min(0, '>= 0')`,
    fields: [
      { key: 'name', type: 'text', label: 'Tên mục tiêu' },
      { key: 'target_amount', type: 'number', label: 'Mục tiêu', format: 'formatCurrency(Number(i.target_amount||0)/100)' }
    ]
  },
  {
    name: 'ExchangeRate',
    route: 'exchange-rates',
    actions: 'exchange-rates',
    fetcher: 'fetchExchangeRates',
    schemaObj: `currency_code: z.string().min(1, 'Bắt buộc'), rate: z.number().min(0, '>= 0')`,
    fields: [
      { key: 'currency_code', type: 'text', label: 'Tiền tệ' },
      { key: 'rate', type: 'number', label: 'Tỷ giá', format: 'i.rate' }
    ]
  }
];

modules.forEach(m => {
  const p = path.join(root, m.route);
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
  fs.writeFileSync(path.join(p, `${m.name}Client.tsx`), buildClient(m.name, m.route, m.fields, m.actions, m.schemaObj));
  fs.writeFileSync(path.join(p, `page.tsx`), buildPage(m.name, m.route, m.fetcher));
});
