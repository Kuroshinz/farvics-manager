'use server';

const simulateDelay = () => new Promise(resolve => setTimeout(resolve, 800));

export async function fetchAccounts() {
  await simulateDelay();
  return [
    { id: '1', name: 'Operating Account', currency: 'USD', balance: '$124,500.00', status: 'Active' },
    { id: '2', name: 'Payroll Reserve', currency: 'USD', balance: '$45,000.00', status: 'Active' },
    { id: '3', name: 'European Ops', currency: 'EUR', balance: '€12,300.00', status: 'Active' },
  ];
}

export async function fetchTransactions() {
  await simulateDelay();
  return [
    { id: '1', date: '2026-08-05', description: 'Stripe Payout', account: 'Operating Account', amount: '+$12,450.00', status: 'Completed' },
    { id: '2', date: '2026-08-04', description: 'AWS Cloud Services', account: 'Operating Account', amount: '-$1,240.00', status: 'Completed' },
  ];
}

export async function fetchJournals() {
  await simulateDelay();
  return [
    { id: '1', reference: 'JNL-2026-08-001', date: '2026-08-05', entries: 4, total: '$12,450.00', status: 'Posted' },
  ];
}

export async function fetchBudgets() {
  await simulateDelay();
  return [
    { id: '1', name: 'Q3 Marketing', period: 'Q3 2026', allocated: '$50,000.00', spent: '$12,450.00', remaining: '$37,550.00', status: 'On Track' },
  ];
}

export async function fetchGoals() {
  await simulateDelay();
  return [
    { id: '1', name: 'Series A Runway', targetDate: '2027-01-01', targetAmount: '$2,000,000.00', currentAmount: '$1,450,000.00', progress: '72%' },
  ];
}

export async function fetchCategories() {
  await simulateDelay();
  return [
    { id: '1', name: 'SaaS Software', type: 'Expense', budget: '$5,000.00', utilization: '42%' },
    { id: '2', name: 'Consulting', type: 'Expense', budget: '$20,000.00', utilization: '80%' },
  ];
}

export async function fetchExchangeRates() {
  await simulateDelay();
  return [
    { id: '1', pair: 'EUR/USD', rate: '1.09', lastUpdated: '10 min ago', status: 'Active' },
    { id: '2', pair: 'GBP/USD', rate: '1.27', lastUpdated: '10 min ago', status: 'Active' },
  ];
}

export async function fetchReports() {
  await simulateDelay();
  return [
    { id: '1', name: 'Q2 2026 P&L', type: 'Financial', generated: '2026-07-01', status: 'Completed' },
    { id: '2', name: 'August Cash Flow', type: 'Cash Flow', generated: '2026-08-01', status: 'Draft' },
  ];
}

export async function fetchReconciliation() {
  await simulateDelay();
  return [
    { id: '1', bankAccount: 'Operating Account', statementDate: '2026-07-31', matchedRecords: 452, discrepancies: 0, status: 'Completed' },
    { id: '2', bankAccount: 'European Ops', statementDate: '2026-07-31', matchedRecords: 14, discrepancies: 2, status: 'Pending' },
  ];
}
