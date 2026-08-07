
import * as React from 'react';
import { Suspense } from 'react';
import { PageHeader } from '../../../components/layouts/AppShell/PageHeader';
import { fetchJournals } from '../../actions/financial-queries';
import { JournalClient } from './JournalClient';

async function DataContainer() {
  const data = await fetchJournals();
  return <JournalClient initialData={data || []} />;
}

export default function Page() {
  return (
    <div className="space-y-6 md:space-y-8 h-full animate-fade-in pb-20">
      <PageHeader title="Journal" description="Quản lý dữ liệu" />
      <Suspense fallback={<div>Loading...</div>}><DataContainer /></Suspense>
    </div>
  );
}