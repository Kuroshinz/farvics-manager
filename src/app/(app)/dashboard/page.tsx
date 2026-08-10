import dynamic from 'next/dynamic';
import { LoadingSkeleton } from '../../../components/ui/LoadingSkeleton';

const KPIGrid = dynamic(() => import('../../../components/dashboard/KPIGrid'), {
  loading: () => <LoadingSkeleton height="120px" className="mb-4" />,
});
const CashflowChart = dynamic(() => import('../../../components/dashboard/CashflowChart'), {
  loading: () => <LoadingSkeleton height="300px" className="mb-4" />,
});
const TransactionTable = dynamic(() => import('../../../components/dashboard/TransactionTable'), {
  loading: () => <LoadingSkeleton height="200px" className="mb-4" />,
});
const ReportHub = dynamic(() => import('../../../components/dashboard/ReportHub'), {
  loading: () => <LoadingSkeleton height="150px" className="mb-4" />,
});

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
      amount: `${isIncome ? '+' : '-'}${Math.abs(tx.amount).toLocaleString()} đ`,
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
