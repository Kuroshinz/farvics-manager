
import * as React from 'react';
import { Suspense } from 'react';
import { PageHeader } from '../../../components/layouts/AppShell/PageHeader';
import { fetchGoals } from '../../actions/financial-queries';
import { translate } from '../../../shared/i18n/server';
import { GoalClient } from './GoalClient';
import { TableSkeleton } from '../../../components/ui/skeleton/Skeleton';

async function DataContainer() {
  const data = await fetchGoals();
  return <GoalClient initialData={data || []} />;
}

export default function Page() {
  return (
    <div className="space-y-6 md:space-y-8 h-full animate-fade-in pb-20">
      <PageHeader title={translate('page.goals.title')} description={translate('page.goals.desc')} breadcrumbs={[{ label: 'Farvics HQ' }, { label: 'Tài chính' }, { label: 'Chi tiết' }]} />
      <Suspense fallback={<TableSkeleton />}><DataContainer /></Suspense>
    </div>
  );
}
  