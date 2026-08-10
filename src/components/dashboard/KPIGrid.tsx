import * as React from 'react';
import { motion } from 'framer-motion';
import { MoreHorizontal, DollarSign, PiggyBank, CreditCard, Sparkles } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ReactNode;
  isPrimary?: boolean;
  delay?: number;
}

function KPICard({ title, value, change, isPositive, icon, isPrimary, delay = 0 }: KPICardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`relative overflow-hidden rounded-2xl border p-5 flex flex-col justify-between h-36 ${
        isPrimary 
          ? 'border-red-500/30 shadow-[0_0_40px_rgba(239,68,68,0.15)]' 
          : 'border-white/10 bg-black/40 backdrop-blur-xl'
      }`}
    >
      {isPrimary && (
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/40 via-red-900/20 to-black pointer-events-none" />
      )}
      
      <div className="relative z-10 flex justify-between items-start">
        <div className={`p-2 rounded-full ${isPrimary ? 'bg-white/10 text-white' : 'bg-white/5 text-white/60'}`}>
          {icon}
        </div>
        <button className="text-white/40 hover:text-white transition-colors">
          <MoreHorizontal size={18} />
        </button>
      </div>

      <div className="relative z-10 mt-auto">
        <div className="text-sm font-medium text-white/70 mb-1">{title}</div>
        <div className="flex items-baseline gap-3">
          <div className="text-3xl font-bold tracking-tight text-white">{value}</div>
          <div className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            isPositive 
              ? isPrimary ? 'bg-white/20 text-white' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'bg-white/10 text-white/70 border border-white/10'
          }`}>
            {isPositive ? '+' : ''}{change}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function KPIGrid({ data = { revenue: 2160000, saving: 1194000, expense: 1663000, net: 910000 } }: { data?: any }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      <KPICard title="Total Revenue" value={`$ ${(data.revenue/100).toLocaleString()}`} change="12.6 %" isPositive={true} icon={<DollarSign size={16} />} isPrimary={true} delay={0.1} />
      <KPICard title="Total Saving" value={`$ ${(data.saving/100).toLocaleString()}`} change="-1.7 %" isPositive={false} icon={<PiggyBank size={16} />} delay={0.2} />
      <KPICard title="Monthly Expense" value={`$ ${(data.expense/100).toLocaleString()}`} change="1.9 %" isPositive={true} icon={<CreditCard size={16} />} delay={0.3} />
      <KPICard title="Net Income" value={`$ ${(data.net/100).toLocaleString()}`} change="0.0 %" isPositive={true} icon={<Sparkles size={16} />} delay={0.4} />
    </div>
  );
}
