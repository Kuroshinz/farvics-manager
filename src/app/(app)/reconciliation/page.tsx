import * as React from 'react';
import { Suspense } from 'react';
import { PageHeader } from '../../../components/layouts/AppShell/PageHeader';
import { DataTable } from '../../../components/ui/data-table/DataTable';
import { TableSkeleton } from '../../../components/ui/skeleton/Skeleton';
import { fetchReconciliation } from '../../actions/financial-queries';
import { Typography } from '../../../components/ui/typography/Typography';

async function DataContainer() {
  const data = await fetchReconciliation();
  
  if (!data || data.length === 0) return <div className="p-8 text-center text-content-muted">No records found.</div>;
  
  const columns = Object.keys(data[0])
    .filter(k => k !== 'id')
    .map(key => ({
      key,
      header: key,
      render: (item: any) => {
         const val = item[key];
         if (key === 'status') {
           const color = val === 'Completed' || val === 'Active' || val === 'On Track' || val === 'Posted' ? 'text-aurora-green' : (val === 'Pending' || val === 'Draft' ? 'text-content-secondary' : 'text-galaxy-red');
           return <span className={`text-xs font-bold uppercase ${color}`}>{val}</span>;
         }
         return <Typography variant="body">{val}</Typography>;
      }
    }));

  return (
    <div className="h-[600px]">
      <DataTable data={data} columns={columns} />
    </div>
  );
}

export default function Page() {
  return (
    <div className="space-y-6 md:space-y-8 h-full animate-fade-in pb-20">
      <PageHeader 
        title="Reconciliation" 
        description="Bank statement matching and integrity verifications."
        breadcrumbs={[{ label: 'Farvics HQ' }, { label: 'Financial' }, { label: 'Reconciliation' }]}
      />
      <Suspense fallback={<TableSkeleton />}>
        <DataContainer />
      </Suspense>
    </div>
  );
}
