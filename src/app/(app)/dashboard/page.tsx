import * as React from 'react';
import { PageHeader } from '../../../components/layouts/AppShell/PageHeader';
import { KPIGrid } from '../../../components/dashboard/KPIGrid';
import { CashflowChart } from '../../../components/dashboard/CashflowChart';
import { TransactionTable } from '../../../components/dashboard/TransactionTable';
import { ReportHub } from '../../../components/dashboard/ReportHub';

export default function DashboardPage() {
  return (
    <div className="space-y-6 md:space-y-8 h-full animate-fade-in pb-20">
      <PageHeader 
        title="Dashboard Overview" 
        description="Welcome back Athan 👋" 
        breadcrumbs={[{ label: 'Farvics HQ' }, { label: 'Dashboard' }]} 
      />
      
      <KPIGrid />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <CashflowChart />
        <ReportHub />
      </div>
      
      <TransactionTable />
    </div>
  );
}
