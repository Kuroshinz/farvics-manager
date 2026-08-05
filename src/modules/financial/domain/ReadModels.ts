// These are representations meant strictly for external consumers of the Financial Domain
export interface AccountBalanceReadModel {
  accountId: string;
  balanceMinorUnits: number;
  currencyCode: string;
  formattedBalance: string;
  lastCalculatedAt: Date;
}

export interface TransactionReadModel {
  transactionId: string;
  type: string;
  date: string;
  entries: {
    accountId: string;
    type: 'DEBIT' | 'CREDIT';
    amountMinorUnits: number;
  }[];
}

export interface CategoryTreeReadModel {
  id: string;
  name: string;
  children: CategoryTreeReadModel[];
}
