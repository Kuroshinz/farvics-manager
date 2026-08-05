import * as React from 'react';
import { Typography } from '../../components/ui/typography/Typography';
import { PageHeader } from '../../components/layouts/AppShell/PageHeader';
import { MetricCard, AIInsightCard, RecentTransactions, ActivityTimeline } from '../../components/features/dashboard/Widgets';
import DynamicChartWidget from '../../components/features/dashboard/DynamicChart';
import { Wallet, TrendingDown, LayoutDashboard, Coins } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-6 md:space-y-8 h-full animate-fade-in pb-20">
      <PageHeader 
        title="Command Center" 
        description="Enterprise liquidity flows and AI-driven projections in real-time."
        breadcrumbs={[{ label: 'Farvics HQ' }, { label: 'Dashboards' }]}
        action={
          <button className="hidden sm:flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-full text-sm font-semibold hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)]">
            Generate Report
          </button>
        }
      />
      
      {/* Metrics Row - Bounded Masonry Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <MetricCard title="Total Revenue" amount="$124,500.00" trend="+12.5%" isPositive={true} icon={Wallet} delay={0.1} />
        <MetricCard title="Monthly Expenses" amount="$42,100.00" trend="-4.2%" isPositive={false} icon={TrendingDown} delay={0.2} />
        <MetricCard title="Net Profit" amount="$82,400.00" trend="+18.1%" isPositive={true} icon={LayoutDashboard} delay={0.3} />
        <MetricCard title="Cash Runway" amount="18 Months" trend="Stable" isPositive={true} icon={Coins} delay={0.4} />
      </div>

      {/* Main Feature Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-auto min-h-[400px]">
        {/* Left Col - Dynamic Chart */}
        <div className="xl:col-span-2 h-[400px] xl:h-auto">
          <DynamicChartWidget />
        </div>
        
        {/* Right Col - AI Insight & Quick Actions */}
        <div className="h-full">
          <AIInsightCard />
        </div>
      </div>

      {/* Bottom Feature Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[500px]">
        <RecentTransactions />
        <ActivityTimeline />
      </div>
    </div>
  );
}
