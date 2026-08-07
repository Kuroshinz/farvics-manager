import * as React from 'react';
import { Suspense } from 'react';
import { PageHeader } from '../../../components/layouts/AppShell/PageHeader';
import { fetchTransactions, fetchAccounts, fetchCategories } from '../../actions/financial-queries';
import { translate } from '../../../shared/i18n/server';
import { TransactionsClient } from './TransactionsClient';
import { TableSkeleton } from '../../../components/ui/skeleton/Skeleton';

async function DataContainer() {
  const [data, accounts, categories] = await Promise.all([
    fetchTransactions(),
    fetchAccounts(),
    fetchCategories()
  ]);
  
  return <TransactionsClient initialData={data || []} accounts={accounts || []} categories={categories || []} />;
}

export default function Page() {
  return (
    <div className="space-y-6 md:space-y-8 h-full animate-fade-in pb-20">
      <PageHeader title={translate('page.transactions.title')} description={translate('page.transactions.desc')} breadcrumbs={[{ label: 'Farvics HQ' }, { label: 'Tài chính' }, { label: 'Giao dịch' }]} />
      <Suspense fallback={<TableSkeleton />}><DataContainer /></Suspense>
    </div>
  );
}
