'use client';
import * as React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, Sparkles, TrendingUp, Wallet, Target, Calendar, Clock, ChevronRight } from 'lucide-react';
import { Typography } from '../../ui/typography/Typography';
import { GlassPanel } from '../../ui/glass-panel/GlassPanel';
import { cn } from '../../../lib/utils';
import { useTranslation } from '../../../providers/I18nProvider';

// Shared Metrics Card
export function MetricCard({ title, amount, trend, isPositive, icon, delay = 0 }: any) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay }}>
      <GlassPanel className="p-6 h-full flex flex-col justify-between group overflow-hidden">
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/[0.02] rounded-full blur-2xl group-hover:bg-white/[0.04] transition-colors" />
        <div className="flex justify-between items-start mb-4 relative z-10">
          <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-content-secondary group-hover:text-white transition-colors">
            {icon}
          </div>
          <div className={cn("flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md", isPositive ? "bg-aurora-green/10 text-aurora-green" : "bg-galaxy-red/10 text-galaxy-red")}>
            {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {trend}
          </div>
        </div>
        <div className="relative z-10">
          <Typography variant="label" className="opacity-70 mb-1 block">{title}</Typography>
          <Typography variant="h2" className="tracking-tight">{amount}</Typography>
        </div>
      </GlassPanel>
    </motion.div>
  );
}

// AI Insight Card - Massive visual impact
export function AIInsightCard() {
  const { t } = useTranslation();
  return (
    <GlassPanel className="p-6 md:p-8 h-full relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-galaxy opacity-20 group-hover:opacity-30 transition-opacity duration-700" />
      <div className="absolute -inset-[100%] animate-[spin_10s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,rgba(219,39,119,0)_0%,rgba(219,39,119,0.1)_50%,rgba(219,39,119,0)_100%)] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={16} className="text-galaxy-pink" />
          <Typography variant="label" className="text-galaxy-pink tracking-widest font-bold">{t('dashboard.ai_insight_title')}</Typography>
        </div>
        <Typography variant="h3" className="font-medium text-white/90 leading-snug mb-6">
          {t('dashboard.ai_insight_desc')}
        </Typography>
        <button className="flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white transition-colors mt-auto">
          Execute Allocation <ChevronRight size={16} />
        </button>
      </div>
    </GlassPanel>
  );
}

// Transaction Table Mini
export function RecentTransactions() {
  const { t } = useTranslation();
  const txs = [
    { id: 1, name: 'Stripe Payout', type: 'Income', amount: '+$12,450.00', status: 'Completed', date: 'Today' },
    { id: 2, name: 'AWS Cloud', type: 'Expense', amount: '-$1,240.00', status: 'Completed', date: 'Yesterday' },
    { id: 3, name: 'Figma Subscription', type: 'Expense', amount: '-$144.00', status: 'Pending', date: 'Aug 2' },
  ];
  return (
    <GlassPanel className="p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <Typography variant="h3" className="text-lg">{t('dashboard.recent_ledger')}</Typography>
        <button className="text-xs text-content-muted hover:text-white transition-colors">{t('dashboard.view_all')}</button>
      </div>
      <div className="flex-1 space-y-4">
        {txs.map(tx => (
          <div key={tx.id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/[0.03] transition-colors group cursor-pointer border border-transparent hover:border-white/5">
            <div className="flex items-center gap-4">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center border", tx.type === 'Income' ? "bg-aurora-green/10 border-aurora-green/20 text-aurora-green" : "bg-white/5 border-white/10 text-content-secondary")}>
                {tx.type === 'Income' ? <TrendingUp size={16} /> : <Wallet size={16} />}
              </div>
              <div>
                <Typography variant="body" className="font-medium text-sm text-white group-hover:text-aurora-cyan transition-colors">{tx.name}</Typography>
                <Typography variant="caption" className="text-xs">{tx.date}</Typography>
              </div>
            </div>
            <div className="text-right">
              <Typography variant="body" className={cn("font-semibold text-sm", tx.type === 'Income' ? "text-white" : "text-white")}>{tx.amount}</Typography>
              <Typography variant="caption" className={cn("text-[10px] uppercase font-bold", tx.status === 'Completed' ? "text-aurora-green/70" : "text-content-muted")}>{tx.status}</Typography>
            </div>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}

// Activity Timeline
export function ActivityTimeline() {
  const { t } = useTranslation();
  return (
    <GlassPanel className="p-6 h-full">
      <Typography variant="h3" className="text-lg mb-6">{t('dashboard.action_timeline')}</Typography>
      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[15px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
        {[1, 2, 3].map((i) => (
          <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white/20 bg-surface shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 text-white">
              <Clock size={12} />
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl bg-white/[0.02] border border-white/5 shadow">
               <Typography variant="body" className="text-sm font-medium">Reconciliation #{i}482</Typography>
               <Typography variant="caption" className="text-xs">System auto-matched 45 records.</Typography>
            </div>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}


