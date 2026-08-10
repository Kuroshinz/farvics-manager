import * as React from 'react';
import { motion } from 'framer-motion';
import { FileText, FileSpreadsheet, FileBarChart2, ChevronRight } from 'lucide-react';

export function ReportHub() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.7 }}
      className="col-span-1 border border-white/10 bg-black/40 backdrop-blur-xl rounded-2xl p-6 flex flex-col"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-white">Report Generation</h3>
        <button className="text-xs text-aurora-cyan hover:text-white transition-colors">View Archives</button>
      </div>

      <div className="flex-1 flex flex-col gap-3">
        <button className="w-full flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all group">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-500/10 text-red-400">
              <FileText size={18} />
            </div>
            <div className="text-left">
              <div className="text-sm font-medium text-white">Monthly Audit</div>
              <div className="text-xs text-white/40">PDF Format • Last 30 Days</div>
            </div>
          </div>
          <ChevronRight size={16} className="text-white/30 group-hover:text-white transition-colors" />
        </button>

        <button className="w-full flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all group">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <FileSpreadsheet size={18} />
            </div>
            <div className="text-left">
              <div className="text-sm font-medium text-white">Cashflow Export</div>
              <div className="text-xs text-white/40">CSV Format • Raw Data</div>
            </div>
          </div>
          <ChevronRight size={16} className="text-white/30 group-hover:text-white transition-colors" />
        </button>

        <button className="w-full flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all group mt-auto">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <FileBarChart2 size={18} />
            </div>
            <div className="text-left">
              <div className="text-sm font-medium text-white">Q3 Projections</div>
              <div className="text-xs text-white/40">Excel Format • Analytical</div>
            </div>
          </div>
          <ChevronRight size={16} className="text-white/30 group-hover:text-white transition-colors" />
        </button>
      </div>
    </motion.div>
  );
}
