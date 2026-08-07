
import * as React from 'react';
import { Suspense } from 'react';
import { PageHeader } from '../../../components/layouts/AppShell/PageHeader';
import { fetchExchangeRates } from '../../actions/financial-queries';
import { translate } from '../../../shared/i18n/server';
import { ExchangeRateClient } from './ExchangeRateClient';
import { TableSkeleton } from '../../../components/ui/skeleton/Skeleton';

async function DataContainer() {
  const data = await fetchExchangeRates();
  return <ExchangeRateClient initialData={data || []} />;
}

export default function Page() {
  return (
    <div className="space-y-6 md:space-y-8 h-full animate-fade-in pb-20">
      <PageHeader title={translate('page.exchange-rates.title')} description={translate('page.exchange-rates.desc')} breadcrumbs={[{ label: 'Farvics HQ' }, { label: 'Tài chính' }, { label: 'Chi tiết' }]} />
      <Suspense fallback={<TableSkeleton />}><DataContainer /></Suspense>
    </div>
  );
}
  