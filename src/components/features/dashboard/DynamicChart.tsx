'use client';
import * as React from 'react';
import { GlassPanel } from '../../ui/glass-panel/GlassPanel';
import { Typography } from '../../ui/typography/Typography';
import { useTranslation } from '../../../providers/I18nProvider';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'T2', revenue: 4000, expenses: 2400 },
  { name: 'T3', revenue: 3000, expenses: 1398 },
  { name: 'T4', revenue: 2000, expenses: 9800 },
  { name: 'T5', revenue: 2780, expenses: 3908 },
  { name: 'T6', revenue: 1890, expenses: 4800 },
  { name: 'T7', revenue: 2390, expenses: 3800 },
  { name: 'CN', revenue: 3490, expenses: 4300 },
];

export default function DynamicChartWidget({ amount = "0 ₫" }: { amount?: string }) {
  const { t } = useTranslation();
  return (
    <GlassPanel className="p-6 h-full flex flex-col relative overflow-hidden group">
      <div className="flex justify-between items-center mb-6 relative z-10">
        <div>
          <Typography variant="label" className="opacity-70">{t('dashboard.cash_flow_velocity')}</Typography>
          <Typography variant="h2" className="mt-1">{amount}</Typography>
        </div>
        <div className="flex gap-2">
          {['1W', '1M', '1Y'].map(t => (
            <button key={t} className="px-3 py-1 rounded-lg text-xs font-medium border border-white/10 bg-white/5 hover:bg-white/10 text-content-secondary hover:text-white transition-colors">{t}</button>
          ))}
        </div>
      </div>
      
      <div className="flex-1 w-full relative min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#06B6D4" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
            <Area type="monotone" dataKey="revenue" stroke="#06B6D4" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </GlassPanel>
  );
}
