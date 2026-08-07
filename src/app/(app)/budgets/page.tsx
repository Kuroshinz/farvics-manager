import * as React from 'react';
import { Suspense } from 'react';
import { PageHeader } from '../../../components/layouts/AppShell/PageHeader';
import { fetchBudgets, fetchAccounts, fetchCategories } from '../../actions/financial-queries';
import { translate } from '../../../shared/i18n/server';
import { BudgetsClient } from './BudgetsClient';
import { TableSkeleton } from '../../../components/ui/skeleton/Skeleton';

async function DataContainer() {
  const [data, accounts, categories] = await Promise.all([
    fetchBudgets(),
    fetchAccounts(),
    fetchCategories()
  ]);
  
  return <BudgetsClient initialData={data || []} accounts={accounts || []} categories={categories || []} />;
}

export default function Page() {
  return (
    <div className="space-y-6 md:space-y-8 h-full animate-fade-in pb-20">
      <PageHeader title={translate('page.budgets.title')} description={translate('page.budgets.desc')} breadcrumbs={[{ label: 'Farvics HQ' }, { label: 'Tài chính' }, { label: 'Ngân sách' }]} />
      <Suspense fallback={<TableSkeleton />}><DataContainer /></Suspense>
    </div>
  );
}
