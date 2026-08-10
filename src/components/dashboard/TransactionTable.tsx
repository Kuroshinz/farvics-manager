import * as React from 'react';
import { motion } from 'framer-motion';
import { MoreHorizontal, Download, Filter, ArrowUpDown } from 'lucide-react';

const mockTransactions = [
  { id: 1, date: '2025-11-10', desc: 'Payment from Acme Corp.', type: 'Income', category: 'Sales Revenue', amount: '+$1,250.00', status: 'Completed' },
  { id: 2, date: '2025-11-10', desc: 'Monthly Software Subscription', type: 'Expense', category: 'Software/SaaS', amount: '-$89.99', status: 'Schedule' },
  { id: 3, date: '2025-11-09', desc: 'Client Project Deposit (Phase 1)', type: 'Income', category: 'Sales Revenue', amount: '+$5,100.00', status: 'Pending' },
  { id: 4, date: '2025-11-08', desc: 'Office Supplies Restock', type: 'Expense', category: 'Operations', amount: '-$340.50', status: 'Completed' },
];

function StatusBadge({ status }: { status: string }) {
  let styles = '';
  let dot = '';
  
  switch (status) {
    case 'Completed':
      styles = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      dot = 'bg-emerald-400';
      break;
    case 'Schedule':
      styles = 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      dot = 'bg-blue-400';
      break;
    case 'Pending':
      styles = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      dot = 'bg-amber-400';
      break;
    default:
      styles = 'bg-white/10 text-white/70 border-white/10';
      dot = 'bg-white/50';
  }

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${styles}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`}></span>
      {status}
    </div>
  );
}

export function TransactionTable() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="mt-8 border border-white/10 bg-black/40 backdrop-blur-xl rounded-2xl p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-white">Transaction history</h3>
        <div className="flex gap-2">
          <button className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-colors"><Download size={16} /></button>
          <button className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-colors"><Filter size={16} /></button>
          <button className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-colors"><ArrowUpDown size={16} /></button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-xs text-white/40 border-b border-white/10">
              <th className="pb-3 font-medium">Date</th>
              <th className="pb-3 font-medium">Desc</th>
              <th className="pb-3 font-medium">Type</th>
              <th className="pb-3 font-medium">Category</th>
              <th className="pb-3 font-medium">Amount</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium text-right"></th>
            </tr>
          </thead>
          <tbody className="text-sm text-white/80">
            {mockTransactions.map((tx) => (
              <tr key={tx.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                <td className="py-4">{tx.date}</td>
                <td className="py-4 text-white font-medium">{tx.desc}</td>
                <td className="py-4">{tx.type}</td>
                <td className="py-4">{tx.category}</td>
                <td className={`py-4 font-medium ${tx.amount.startsWith('+') ? 'text-emerald-400' : 'text-white'}`}>{tx.amount}</td>
                <td className="py-4"><StatusBadge status={tx.status} /></td>
                <td className="py-4 text-right">
                  <button className="text-white/30 hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                    <MoreHorizontal size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
