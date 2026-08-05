import { ICommand } from '../../../../shared/application/Pipeline';

export class CreateJournalCommand implements ICommand { constructor(public readonly payload: any) {} }
export class PostJournalCommand implements ICommand { constructor(public readonly journalId: string) {} }
export class ReverseJournalCommand implements ICommand { constructor(public readonly journalId: string, public readonly reversalDate: Date) {} }
export class CreateBudgetCommand implements ICommand { constructor(public readonly payload: any) {} }
export class UpdateBudgetCommand implements ICommand { constructor(public readonly budgetId: string, public readonly payload: any) {} }
export class ArchiveBudgetCommand implements ICommand { constructor(public readonly budgetId: string) {} }
export class CreateCategoryCommand implements ICommand { constructor(public readonly payload: any) {} }
export class DeleteCategoryCommand implements ICommand { constructor(public readonly categoryId: string) {} }
export class CreateExchangeRateCommand implements ICommand { constructor(public readonly payload: any) {} }
export class ReconcileStatementCommand implements ICommand { constructor(public readonly payload: any) {} }
