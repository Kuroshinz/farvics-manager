import * as React from 'react';
import { PageHeader } from '../../../components/layouts/AppShell/PageHeader';
import { KPIGrid } from '../../../components/dashboard/KPIGrid';
import { CashflowChart } from '../../../components/dashboard/CashflowChart';
import { TransactionTable } from '../../../components/dashboard/TransactionTable';
import { ReportHub } from '../../../components/dashboard/ReportHub';
import { fetchTransactions, fetchAccounts } from '../../actions/financial-queries';

export default async function DashboardPage() {
  const [transactions, accounts] = await Promise.all([
    fetchTransactions(),
    fetchAccounts()
  ]);

  // Aggregate KPI data
  let revenue = 0;
  let expense = 0;
  
  const formattedTransactions = (transactions || []).map((tx: any) => {
    const isIncome = tx.amount > 0;
    if (isIncome) revenue += tx.amount;
    else expense += Math.abs(tx.amount);
    
    return {
      id: tx.id,
      date: new Date(tx.date || tx.created_at).toISOString().split('T')[0],
      desc: tx.description || 'N/A',
      type: isIncome ? 'Income' : 'Expense',
      category: tx.category_id || 'Uncategorized', // Should map to name later
      amount: `${isIncome ? '+' : '-'}$${(Math.abs(tx.amount)/100).toLocaleString()}`,
      status: tx.status || 'Completed'
    };
  });

  const kpiData = {
    revenue,
    expense,
    saving: (revenue - expense) * 0.2, // Mock savings ratio for now
    net: revenue - expense
  };

  return (
    <div className="space-y-6 md:space-y-8 h-full animate-fade-in pb-20">
      <PageHeader 
        title="Dashboard Overview" 
        description="Welcome back 👋" 
        breadcrumbs={[{ label: 'Farvics HQ' }, { label: 'Dashboard' }]} 
      />
      
      <KPIGrid data={kpiData} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <CashflowChart />
        <ReportHub />
      </div>
      
      <TransactionTable transactions={formattedTransactions} />
    </div>
  );
}
