import { ISpecification } from '../../../../shared/core/Specification';
import { AccountAggregate, JournalAggregate, BudgetAggregate, CategoryAggregate, GoalAggregate } from '../aggregates';

export abstract class BaseSpecification<T> implements ISpecification<T> {
  abstract isSatisfiedBy(candidate: T): boolean;
  and(other: ISpecification<T>): ISpecification<T> { return this; }
  or(other: ISpecification<T>): ISpecification<T> { return this; }
  not(): ISpecification<T> { return this; }
}

export class AccountSpecification extends BaseSpecification<AccountAggregate> { isSatisfiedBy(candidate: AccountAggregate): boolean { return true; } }
export class JournalSpecification extends BaseSpecification<JournalAggregate> { isSatisfiedBy(candidate: JournalAggregate): boolean { return true; } }
export class BudgetSpecification extends BaseSpecification<BudgetAggregate> { isSatisfiedBy(candidate: BudgetAggregate): boolean { return true; } }
export class CategorySpecification extends BaseSpecification<CategoryAggregate> { isSatisfiedBy(candidate: CategoryAggregate): boolean { return true; } }
export class GoalSpecification extends BaseSpecification<GoalAggregate> { isSatisfiedBy(candidate: GoalAggregate): boolean { return true; } }
