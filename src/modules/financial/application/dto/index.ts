// Request DTOs
export interface CreateJournalRequest {
  date: string;
  description: string;
  entries: { accountId: string; amount: number; type: 'DEBIT' | 'CREDIT' }[];
}

export interface CreateBudgetRequest {
  name: string;
  periodId: string;
  limitMinorUnits: number;
}

// Response DTOs (strictly no Domain objects)
export interface JournalResponse {
  id: string;
  status: string;
  date: string;
  description: string;
  entries: { accountId: string; amountMinorUnits: number; type: string }[];
}

export interface BudgetResponse {
  id: string;
  name: string;
  periodId: string;
  limitMinorUnits: number;
  consumedMinorUnits: number;
  isOverspent: boolean;
}
