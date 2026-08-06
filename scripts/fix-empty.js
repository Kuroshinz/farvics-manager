const fs = require('fs');
const path = require('path');

const pagesDir = 'd:\\ManagerMn\\src\\app\\(app)';
const routes = ['accounts', 'transactions', 'journals', 'budgets', 'goals', 'categories', 'exchange-rates', 'reports', 'reconciliation'];

for (const route of routes) {
  const pagePath = path.join(pagesDir, route, 'page.tsx');
  if (fs.existsSync(pagePath)) {
    let content = fs.readFileSync(pagePath, 'utf8');
    
    // Add import EmptyState
    if (!content.includes('EmptyState')) {
      content = content.replace("import { DataTable }", "import { EmptyState } from '../../../components/ui/empty-state/EmptyState';\nimport { DataTable }");
    }
    
    // Replace the gap where we removed the early return, and put back a safe early return
    content = content.replace("const data = await fetchTransactions();\n  \n    \n  const columns", "const data = await fetchTransactions();\n  if (!data || data.length === 0) return <div className=\"mt-8\"><EmptyState description={translate('common.no_records_desc')} /></div>;\n  const columns");
    content = content.replace("const data = await fetchAccounts();\n  \n    \n  const columns", "const data = await fetchAccounts();\n  if (!data || data.length === 0) return <div className=\"mt-8\"><EmptyState description={translate('common.no_records_desc')} /></div>;\n  const columns");
    content = content.replace("const data = await fetchJournals();\n  \n    \n  const columns", "const data = await fetchJournals();\n  if (!data || data.length === 0) return <div className=\"mt-8\"><EmptyState description={translate('common.no_records_desc')} /></div>;\n  const columns");
    content = content.replace("const data = await fetchBudgets();\n  \n    \n  const columns", "const data = await fetchBudgets();\n  if (!data || data.length === 0) return <div className=\"mt-8\"><EmptyState description={translate('common.no_records_desc')} /></div>;\n  const columns");
    content = content.replace("const data = await fetchGoals();\n  \n    \n  const columns", "const data = await fetchGoals();\n  if (!data || data.length === 0) return <div className=\"mt-8\"><EmptyState description={translate('common.no_records_desc')} /></div>;\n  const columns");
    content = content.replace("const data = await fetchCategories();\n  \n    \n  const columns", "const data = await fetchCategories();\n  if (!data || data.length === 0) return <div className=\"mt-8\"><EmptyState description={translate('common.no_records_desc')} /></div>;\n  const columns");
    content = content.replace("const data = await fetchExchangeRates();\n  \n    \n  const columns", "const data = await fetchExchangeRates();\n  if (!data || data.length === 0) return <div className=\"mt-8\"><EmptyState description={translate('common.no_records_desc')} /></div>;\n  const columns");
    content = content.replace("const data = await fetchReports();\n  \n    \n  const columns", "const data = await fetchReports();\n  if (!data || data.length === 0) return <div className=\"mt-8\"><EmptyState description={translate('common.no_records_desc')} /></div>;\n  const columns");
    content = content.replace("const data = await fetchReconciliation();\n  \n    \n  const columns", "const data = await fetchReconciliation();\n  if (!data || data.length === 0) return <div className=\"mt-8\"><EmptyState description={translate('common.no_records_desc')} /></div>;\n  const columns");
    
    fs.writeFileSync(pagePath, content, 'utf8');
  }
}
