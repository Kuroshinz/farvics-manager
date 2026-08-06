import * as React from 'react';
import { Suspense } from 'react';
import { PageHeader } from '../../../components/layouts/AppShell/PageHeader';
import { EmptyState } from '../../../components/ui/empty-state/EmptyState';
import { DataTable } from '../../../components/ui/data-table/DataTable';
import { TableSkeleton } from '../../../components/ui/skeleton/Skeleton';
import { fetchExchangeRates } from '../../actions/financial-queries';
import { Typography } from '../../../components/ui/typography/Typography';
import { translate } from '../../../shared/i18n/server';
import { formatCurrency } from '../../../shared/i18n/formatters';

async function DataContainer() {
  const data = await fetchExchangeRates();
  if (!data || data.length === 0) return <div className="mt-8"><EmptyState description={translate('common.no_records_desc')} /></div>;
  const columns = Object.keys(data[0])
    .filter(k => k !== 'id')
    .map(key => ({
      key,
      header: translate(`field.${key}`) || key,
      render: (item: any) => {
         const val = item[key];
         
         // Format currency mock
         let displayVal = val;
         if (key === 'balance' || key === 'amount' || key === 'total' || key === 'allocated' || key === 'spent' || key === 'remaining' || key === 'targetAmount' || key === 'currentAmount' || key === 'budget') {
            if (typeof val === 'number') {
              displayVal = formatCurrency(val);
            } else if (typeof val === 'string' && val.includes('$')) {
              displayVal = formatCurrency(parseFloat(val.replace(/[^0-9.-]+/g,"")));
            }
         }

         if (key === 'status') {
           const color = val === 'Completed' || val === 'Active' || val === 'On Track' || val === 'Posted' ? 'text-aurora-green' : (val === 'Pending' || val === 'Draft' ? 'text-content-secondary' : 'text-galaxy-red');
           return <span className={`text-xs font-bold uppercase ${color}`}>{displayVal}</span>;
         }
         return <Typography variant="body">{displayVal}</Typography>;
      }
    }));

  return (
    <div className="h-[600px]">
      <DataTable data={data} columns={columns} emptyStateMessage={translate('common.no_records')} />
    </div>
  );
}

export default function Page() {
  return (
    <div className="space-y-6 md:space-y-8 h-full animate-fade-in pb-20">
      <PageHeader 
        title={translate('page.exchange_rates.title')} 
        description={translate('page.exchange_rates.desc')}
        breadcrumbs={[
          { label: translate('common.farvics_hq') }, 
          { label: translate('common.financial') }, 
          { label: translate('page.exchange_rates.title') }
        ]}
      />
      <Suspense fallback={<TableSkeleton />}>
        <DataContainer />
      </Suspense>
    </div>
  );
}
