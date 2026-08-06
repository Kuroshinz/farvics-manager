const fs = require('fs');

let widgets = fs.readFileSync('d:\\ManagerMn\\src\\components\\features\\dashboard\\Widgets.tsx', 'utf8');

widgets = widgets.replace("export function RecentTransactions() {", "export function RecentTransactions({ transactions = [] }: { transactions?: any[] }) {");
widgets = widgets.replace(
  "const txs = [\n    { id: 1, name: 'Stripe Payout', type: 'Income', amount: '+$12,450.00', status: 'Completed', date: 'Today' },\n    { id: 2, name: 'AWS Cloud', type: 'Expense', amount: '-$1,240.00', status: 'Completed', date: 'Yesterday' },\n    { id: 3, name: 'Figma Subscription', type: 'Expense', amount: '-$144.00', status: 'Pending', date: 'Aug 2' },\n  ];",
  "const txs = transactions;"
);
widgets = widgets.replace("import { cn } from '../../../lib/utils';", "import { cn } from '../../../lib/utils';\nimport { EmptyState } from '../../ui/empty-state/EmptyState';");

// Update the rendering map to handle empty state
const emptyStateStr = `
      <div className="flex-1 space-y-4">
        {txs.length === 0 ? (
          <EmptyState title={t('dashboard.empty_ledger')} description={t('common.no_records_desc')} />
        ) : (
          txs.map(tx => (
`;

widgets = widgets.replace('<div className="flex-1 space-y-4">\n        {txs.map(tx => (', emptyStateStr);

// Close the ternary
widgets = widgets.replace('</div>\n    </GlassPanel>', ')}\n      </div>\n    </GlassPanel>');

// Fix properties for real DB mapping
widgets = widgets.replace('tx.name', 'tx.description || tx.name');
widgets = widgets.replace('tx.amount', 'tx.amount ? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(tx.amount) : "0 ?"');

fs.writeFileSync('d:\\ManagerMn\\src\\components\\features\\dashboard\\Widgets.tsx', widgets, 'utf8');
