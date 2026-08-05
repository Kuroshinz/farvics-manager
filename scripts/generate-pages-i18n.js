const fs = require('fs');
const path = require('path');

const pages = [
  { path: 'accounts', titleKey: 'page.accounts.title', descKey: 'page.accounts.desc', action: 'fetchAccounts' },
  { path: 'transactions', titleKey: 'page.transactions.title', descKey: 'page.transactions.desc', action: 'fetchTransactions' },
  { path: 'journals', titleKey: 'page.journals.title', descKey: 'page.journals.desc', action: 'fetchJournals' },
  { path: 'budgets', titleKey: 'page.budgets.title', descKey: 'page.budgets.desc', action: 'fetchBudgets' },
  { path: 'goals', titleKey: 'page.goals.title', descKey: 'page.goals.desc', action: 'fetchGoals' },
  { path: 'categories', titleKey: 'page.categories.title', descKey: 'page.categories.desc', action: 'fetchCategories' },
  { path: 'exchange-rates', titleKey: 'page.exchange_rates.title', descKey: 'page.exchange_rates.desc', action: 'fetchExchangeRates' },
  { path: 'reports', titleKey: 'page.reports.title', descKey: 'page.reports.desc', action: 'fetchReports' },
  { path: 'reconciliation', titleKey: 'page.reconciliation.title', descKey: 'page.reconciliation.desc', action: 'fetchReconciliation' }
];

pages.forEach(p => {
  const code = `import * as React from 'react';
import { Suspense } from 'react';
import { PageHeader } from '../../../components/layouts/AppShell/PageHeader';
import { DataTable } from '../../../components/ui/data-table/DataTable';
import { TableSkeleton } from '../../../components/ui/skeleton/Skeleton';
import { ${p.action} } from '../../actions/financial-queries';
import { Typography } from '../../../components/ui/typography/Typography';
import { translate } from '../../../shared/i18n/server';
import { formatCurrency } from '../../../shared/i18n/formatters';

async function DataContainer() {
  const data = await ${p.action}();
  
  if (!data || data.length === 0) return <div className="p-8 text-center text-content-muted">{translate('common.no_records')}</div>;
  
  const columns = Object.keys(data[0])
    .filter(k => k !== 'id')
    .map(key => ({
      key,
      header: key, // Could translate headers dynamically here if we added dict entries
      render: (item: any) => {
         const val = item[key];
         
         // Format currency mock
         let displayVal = val;
         if (key === 'balance' || key === 'amount' || key === 'total' || key === 'allocated' || key === 'spent' || key === 'remaining' || key === 'targetAmount' || key === 'currentAmount' || key === 'budget') {
            if (typeof val === 'number') {
              displayVal = formatCurrency(val);
            } else if (typeof val === 'string' && val.includes('$')) {
              displayVal = formatCurrency(parseFloat(val.replace(/[^0-9.-]+/g,"")));
            }
         }

         if (key === 'status') {
           const color = val === 'Completed' || val === 'Active' || val === 'On Track' || val === 'Posted' ? 'text-aurora-green' : (val === 'Pending' || val === 'Draft' ? 'text-content-secondary' : 'text-galaxy-red');
           return <span className={\`text-xs font-bold uppercase \${color}\`}>{displayVal}</span>;
         }
         return <Typography variant="body">{displayVal}</Typography>;
      }
    }));

  return (
    <div className="h-[600px]">
      <DataTable data={data} columns={columns} emptyStateMessage={translate('common.no_records')} />
    </div>
  );
}

export default function Page() {
  return (
    <div className="space-y-6 md:space-y-8 h-full animate-fade-in pb-20">
      <PageHeader 
        title={translate('${p.titleKey}')} 
        description={translate('${p.descKey}')}
        breadcrumbs={[
          { label: translate('common.farvics_hq') }, 
          { label: translate('common.financial') }, 
          { label: translate('${p.titleKey}') }
        ]}
      />
      <Suspense fallback={<TableSkeleton />}>
        <DataContainer />
      </Suspense>
    </div>
  );
}
`;
  fs.writeFileSync(path.join('d:\\ManagerMn\\src\\app\\(app)', p.path, 'page.tsx'), code);
});
