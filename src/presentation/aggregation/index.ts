import { IMediator } from '../../shared/application/Pipeline';
import { GetAccountBalance, GetBudgetSummary, GetCashFlow, GetCategoryTree } from '../../modules/financial/application/queries';

export interface DashboardSummaryDto {
  accounts: unknown[];
  budgets: unknown;
  cashFlow: unknown;
  netWorth: number;
}

export class DashboardAggregator {
  constructor(private readonly mediator: IMediator) {}

  async getDashboard(userId: string): Promise<DashboardSummaryDto> {
    // In a real application, multiple queries would execute in parallel via Promise.all
    const [accounts, budgets, cashFlow] = await Promise.all([
      this.mediator.query(new GetAccountBalance(userId)),
      this.mediator.query(new GetBudgetSummary('default-budget')),
      this.mediator.query(new GetCashFlow('current-period'))
    ]);

    return {
      accounts: Array.isArray(accounts) ? accounts : [accounts],
      budgets,
      cashFlow,
      netWorth: 0 // Placeholder
    };
  }
}

export class FinancialAggregator {
  constructor(private readonly mediator: IMediator) {}

  async getFinancialOverview(): Promise<unknown> {
    const categories = await this.mediator.query(new GetCategoryTree());
    return { categories };
  }
}

export class ReportAggregator {
  constructor(private readonly mediator: IMediator) {}

  async getMonthlyReport(): Promise<unknown> {
    return { type: 'monthly' };
  }
}
