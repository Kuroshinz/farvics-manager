import { AccountAggregate, JournalAggregate, BudgetAggregate, CategoryAggregate, GoalAggregate } from '../aggregates';

export class AccountFactory { static createNew(): AccountAggregate { return new AccountAggregate(); } }
export class JournalFactory { static createNew(): JournalAggregate { return new JournalAggregate(); } }
export class BudgetFactory { static createNew(): BudgetAggregate { return new BudgetAggregate(); } }
export class CategoryFactory { static createNew(): CategoryAggregate { return new CategoryAggregate(); } }
export class GoalFactory { static createNew(): GoalAggregate { return new GoalAggregate(); } }
