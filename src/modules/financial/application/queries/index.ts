import { IQuery } from '../../../../shared/application/Pipeline';

export class GetJournalById implements IQuery { constructor(public readonly id: string) {} }
export class GetLedger implements IQuery { constructor(public readonly filter: any) {} }
export class GetCashFlow implements IQuery { constructor(public readonly periodId: string) {} }
export class GetBudgetSummary implements IQuery { constructor(public readonly budgetId: string) {} }
export class GetAccountBalance implements IQuery { constructor(public readonly accountId: string) {} }
export class GetCategoryTree implements IQuery {}
export class GetReconciliationStatus implements IQuery { constructor(public readonly statementId: string) {} }
