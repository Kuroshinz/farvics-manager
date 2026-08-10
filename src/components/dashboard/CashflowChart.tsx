'use client';

import * as React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const data = [
  { name: 'Jan', income: 12000, outcome: 4000 },
  { name: 'Feb', income: 15000, outcome: 6000 },
  { name: 'Mar', income: 17000, outcome: 5000 },
  { name: 'Apr', income: 20000, outcome: 8000 },
  { name: 'May', income: 23000, outcome: 11000 },
  { name: 'Jun', income: 25000, outcome: 9000 },
  { name: 'Jul', income: 27000, outcome: 12000 },
  { name: 'Aug', income: 26000, outcome: 10000 },
  { name: 'Sep', income: 28000, outcome: 13000 },
  { name: 'Oct', income: 30000, outcome: 15000 },
  { name: 'Nov', income: 32000, outcome: 14000 },
  { name: 'Dec', income: 35000, outcome: 18000 },
];

export function CashflowChart() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="col-span-1 lg:col-span-2 border border-white/10 bg-black/40 backdrop-blur-xl rounded-2xl p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-white">Your Assets</h3>
        <select className="bg-white/5 border border-white/10 text-white text-xs rounded-lg px-3 py-1.5 outline-none">
          <option>Monthly</option>
          <option>Quarterly</option>
          <option>Yearly</option>
        </select>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorOutcome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a3a3a3" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#a3a3a3" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
            <XAxis dataKey="name" stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val/1000}K`} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
              itemStyle={{ color: '#fff' }}
            />
            <Area type="monotone" dataKey="outcome" stroke="#a3a3a3" fillOpacity={1} fill="url(#colorOutcome)" strokeWidth={2} />
            <Area type="monotone" dataKey="income" stroke="#ef4444" fillOpacity={1} fill="url(#colorIncome)" strokeWidth={2} activeDot={{ r: 6, fill: '#fff', stroke: '#ef4444', strokeWidth: 2, className: 'drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
