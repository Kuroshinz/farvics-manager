const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');

const accountsPagePath = path.join(root, 'src/app/(app)/accounts/page.tsx');
let pageCode = fs.readFileSync(accountsPagePath, 'utf8');

// Replace everything related to DataContainer with AccountsClient
pageCode = `import * as React from 'react';
import { Suspense } from 'react';
import { PageHeader } from '../../../components/layouts/AppShell/PageHeader';
import { fetchAccounts } from '../../actions/financial-queries';
import { translate } from '../../../shared/i18n/server';
import { AccountsClient } from './AccountsClient';
import { TableSkeleton } from '../../../components/ui/skeleton/Skeleton';

async function DataContainer() {
  const data = await fetchAccounts();
  return <AccountsClient initialData={data || []} />;
}

export default function Page() {
  return (
    <div className="space-y-6 md:space-y-8 h-full animate-fade-in pb-20">
      <PageHeader 
        title={translate('page.accounts.title')} 
        description={translate('page.accounts.desc')}
        breadcrumbs={[
          { label: translate('common.farvics_hq') }, 
          { label: translate('common.financial') }, 
          { label: translate('page.accounts.title') }
        ]}
      />
      <Suspense fallback={<TableSkeleton />}>
        <DataContainer />
      </Suspense>
    </div>
  );
}
`;

fs.writeFileSync(accountsPagePath, pageCode, 'utf8');
console.log('[PATCHED] accounts/page.tsx to use Client CRUD component');
