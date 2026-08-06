import * as React from 'react';
import { Suspense } from 'react';
import { PageHeader } from '../../components/layouts/AppShell/PageHeader';
import { MetricCard, AIInsightCard, RecentTransactions, ActivityTimeline } from '../../components/features/dashboard/Widgets';
import DynamicChartWidget from '../../components/features/dashboard/DynamicChart';
import { Wallet, TrendingDown, LayoutDashboard, Coins } from 'lucide-react';
import { translate } from '../../shared/i18n/server';
import { getDashboardGatewayData, fetchTransactions } from '../actions/financial-queries';
import { formatCurrency } from '../../shared/i18n/formatters';

async function DashboardContent() {
  const [dashboardData, recentTxs] = await Promise.all([
    getDashboardGatewayData(),
    fetchTransactions()
  ]);

  const { metrics } = dashboardData;

  // Format real aggregated data, or default if empty
  const formattedRevenue = formatCurrency(metrics.revenue || 0);
  const formattedExpenses = formatCurrency(metrics.expenses || 0);
  const formattedProfit = formatCurrency(metrics.profit || 0);
  const formattedCapital = formatCurrency(metrics.capital || 0);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <MetricCard title={translate("dashboard.revenue")} amount={formattedRevenue} trend={translate("dashboard.stable")} isPositive={true} icon={<Wallet size={18} strokeWidth={1.5} />} delay={0.1} />
        <MetricCard title={translate("dashboard.expenses")} amount={formattedExpenses} trend={translate("dashboard.stable")} isPositive={false} icon={<TrendingDown size={18} strokeWidth={1.5} />} delay={0.2} />
        <MetricCard title={translate("dashboard.profit")} amount={formattedProfit} trend={translate("dashboard.stable")} isPositive={true} icon={<LayoutDashboard size={18} strokeWidth={1.5} />} delay={0.3} />
        <MetricCard title={translate("dashboard.runway")} amount={formattedCapital} trend={translate("dashboard.stable")} isPositive={true} icon={<Coins size={18} strokeWidth={1.5} />} delay={0.4} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-auto min-h-[400px]">
        <div className="xl:col-span-2 h-[400px] xl:h-auto">
          <DynamicChartWidget amount={formattedCapital} />
        </div>
        
        <div className="h-full">
          <AIInsightCard insight={dashboardData.insight} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[500px]">
        <RecentTransactions transactions={recentTxs.slice(0, 5)} />
        <ActivityTimeline />
      </div>
    </>
  );
}

export default function DashboardPage() {
  return (
    <div className="space-y-6 md:space-y-8 h-full animate-fade-in pb-20">
      <PageHeader 
        title={translate("dashboard.title")} 
        description={translate("dashboard.desc")}
        breadcrumbs={[{ label: translate('common.farvics_hq') }, { label: translate('common.dashboards') }]}
        action={
          <button className="hidden sm:flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-full text-sm font-semibold hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)]">
            {translate('actions.generate_report')}
          </button>
        }
      />
      <Suspense fallback={<div className="p-12 text-center animate-pulse text-content-muted">{translate('common.loading')}</div>}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}



