'use client';
import * as React from 'react';
import { GlassPanel } from '../../ui/glass-panel/GlassPanel';
import { Typography } from '../../ui/typography/Typography';
import { useTranslation } from '../../../providers/I18nProvider';

// A beautifully simulated SVG chart avoiding heavy Recharts deps for the static skeleton
export default function DynamicChartWidget({ amount = "0 ₫" }: { amount?: string }) {
  const { t } = useTranslation();
  return (
    <GlassPanel className="p-6 h-full flex flex-col relative overflow-hidden group">
      <div className="flex justify-between items-center mb-8 relative z-10">
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
      
      {/* SVG Synthetic Chart */}
      <div className="flex-1 w-full relative mt-4">
        <svg viewBox="0 0 800 200" preserveAspectRatio="none" className="w-full h-full drop-shadow-[0_0_15px_rgba(6,182,212,0.4)]">
          <defs>
            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.5"/>
              <stop offset="100%" stopColor="#06B6D4" stopOpacity="0"/>
            </linearGradient>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#6B21A8" />
              <stop offset="50%" stopColor="#DB2777" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
          </defs>
          <path d="M0,200 L0,150 C100,120 200,180 300,130 C400,80 500,140 600,90 C700,40 800,70 800,70 L800,200 Z" fill="url(#chartGrad)" />
          <path d="M0,150 C100,120 200,180 300,130 C400,80 500,140 600,90 C700,40 800,70 800,70" fill="none" stroke="url(#lineGrad)" strokeWidth="4" className="path-draw" />
        </svg>
        {/* Animated Glow node on chart */}
        <div className="absolute right-[5%] top-[25%] w-4 h-4 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,1)] ring-4 ring-aurora-cyan/30" />
      </div>
    </GlassPanel>
  );
}

