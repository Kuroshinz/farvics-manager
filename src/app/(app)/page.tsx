import { Typography } from '../../components/ui/typography/Typography';
import { GlassPanel } from '../../components/ui/glass-panel/GlassPanel';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <Typography variant="h1">Welcome back, Admin</Typography>
        <Typography variant="body" className="text-content-secondary">Here&apos;s your financial overview for today.</Typography>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassPanel className="p-6">
          <Typography variant="label">Net Worth</Typography>
          <Typography variant="h2" className="mt-2 text-white">$124,500.00</Typography>
          <div className="mt-4 flex items-center text-sm text-aurora-cyan">
             <span className="font-medium">+2.4%</span>
             <span className="ml-2 text-content-muted">from last month</span>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}

