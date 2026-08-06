import * as React from 'react';
import { Typography } from '../typography/Typography';
import { GlassPanel } from '../glass-panel/GlassPanel';
import { cn } from '../../../lib/utils';
import { EmptyState } from '../empty-state/EmptyState';

interface Column<T> {
  key: string;
  header: string;
  render: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  title?: string;
  emptyStateMessage?: string;
}

// Simple mapped data table mimicking virtualized structure for RSC
export function DataTable<T extends { id: string | number }>({ data, columns, title, emptyStateMessage = "No records found" }: DataTableProps<T>) {
  return (
    <GlassPanel className="p-0 overflow-hidden flex flex-col h-full">
      {title && (
        <div className="px-6 py-5 border-b border-white/5">
          <Typography variant="h3" className="text-lg">{title}</Typography>
        </div>
      )}
      <div className="flex-1 overflow-auto hide-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-surface/80 backdrop-blur-xl border-b border-white/5 z-10">
            <tr>
              {columns.map((col, idx) => (
                <th key={col.key} className={cn("px-6 py-4 text-xs font-semibold text-content-muted uppercase tracking-wider", idx === 0 && "pl-6", idx === columns.length - 1 && "text-right pr-6")}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.02]">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-8"><EmptyState description={emptyStateMessage} /></td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group cursor-default">
                  {columns.map((col, idx) => (
                    <td key={col.key} className={cn("px-6 py-4 whitespace-nowrap text-sm text-content-secondary group-hover:text-white transition-colors", idx === 0 && "pl-6", idx === columns.length - 1 && "text-right pr-6")}>
                      {col.render(item)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </GlassPanel>
  );
}


