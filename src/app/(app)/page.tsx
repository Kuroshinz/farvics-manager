'use client';
import * as React from 'react';
import { Typography } from '../../components/ui/typography/Typography';
import { GlassPanel } from '../../components/ui/glass-panel/GlassPanel';
import { PageHeader } from '../../components/layouts/AppShell/PageHeader';
import { Tooltip } from '../../components/ui/tooltip/Tooltip';
import { ContextMenu } from '../../components/ui/context-menu/ContextMenu';

export default function DashboardPage() {
  return (
    <ContextMenu
      menuContent={
        <div className="flex flex-col text-sm text-content-secondary">
          <button className="px-4 py-2 hover:bg-white/10 hover:text-white text-left rounded-lg transition-colors">Refresh Workspace</button>
          <button className="px-4 py-2 hover:bg-white/10 hover:text-white text-left rounded-lg transition-colors">Customize Layout</button>
        </div>
      }
    >
      <div className="space-y-8 h-full">
        <PageHeader 
          title="Intelligence Overview" 
          description="Your centralized command center. Monitor liquidity flows, operational runway, and AI-driven projections in real-time."
          breadcrumbs={[{ label: 'Farvics HQ' }, { label: 'Dashboards' }, { label: 'Overview' }]}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Tooltip content="Total Liquid Assets minus Pending Liabilities">
            <GlassPanel className="p-8 group cursor-default h-full">
              <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:bg-aurora-cyan/20 group-hover:border-aurora-cyan/30 transition-colors duration-500">
                <svg className="w-5 h-5 text-aurora-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <Typography variant="label" className="opacity-80">Liquid Capital</Typography>
              <Typography variant="display" className="mt-3 text-5xl tracking-tighter font-semibold">$1,245.00</Typography>
              <div className="mt-6 flex items-center text-sm">
                 <span className="px-2 py-1 rounded-md bg-aurora-green/10 text-aurora-green font-semibold tracking-wide">+2.4%</span>
                 <span className="ml-3 text-content-muted font-medium">vs last month</span>
              </div>
            </GlassPanel>
          </Tooltip>

          <GlassPanel className="p-8 group cursor-default md:col-span-2 relative overflow-hidden">
            {/* Aesthetic Background Graph representation */}
            <div className="absolute right-0 bottom-0 w-2/3 h-1/2 bg-gradient-to-t from-galaxy-purple/10 to-transparent pointer-events-none" />
            <svg className="absolute right-0 bottom-0 w-2/3 h-2/3 opacity-20 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
               <path d="M0,100 L20,80 L40,90 L60,40 L80,60 L100,20 L100,100 Z" fill="url(#grad)" />
               <defs>
                 <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="0%" stopColor="#DB2777" stopOpacity="0.5" />
                   <stop offset="100%" stopColor="#DB2777" stopOpacity="0" />
                 </linearGradient>
               </defs>
            </svg>

            <Typography variant="label" className="opacity-80">System Activity</Typography>
            <Typography variant="h3" className="mt-2 text-white font-medium">Farvics AI is processing 4 new patterns.</Typography>
          </GlassPanel>
        </div>
      </div>
    </ContextMenu>
  );
}
