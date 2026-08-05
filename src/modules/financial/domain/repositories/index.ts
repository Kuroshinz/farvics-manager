import { IRepository } from '../../../../shared/core/Repository';
import { 
  AccountAggregate, 
  JournalAggregate, 
  BudgetAggregate, 
  CategoryAggregate, 
  GoalAggregate, 
  RecurringTransactionAggregate, 
  ReconciliationAggregate, 
  ExchangeRateAggregate 
} from '../aggregates';
import { ISpecification } from '../../../../shared/core/Specification';

export interface IAccountRepository extends IRepository<AccountAggregate> {
  findBySpecification(spec: ISpecification<AccountAggregate>): Promise<AccountAggregate[]>;
}
export interface IJournalRepository extends IRepository<JournalAggregate> {
  findBySpecification(spec: ISpecification<JournalAggregate>): Promise<JournalAggregate[]>;
}
export interface IBudgetRepository extends IRepository<BudgetAggregate> {
  findBySpecification(spec: ISpecification<BudgetAggregate>): Promise<BudgetAggregate[]>;
}
export interface ICategoryRepository extends IRepository<CategoryAggregate> {
  findBySpecification(spec: ISpecification<CategoryAggregate>): Promise<CategoryAggregate[]>;
}
export interface IGoalRepository extends IRepository<GoalAggregate> {
  findBySpecification(spec: ISpecification<GoalAggregate>): Promise<GoalAggregate[]>;
}
export interface IRecurringTransactionRepository extends IRepository<RecurringTransactionAggregate> {
  findBySpecification(spec: ISpecification<RecurringTransactionAggregate>): Promise<RecurringTransactionAggregate[]>;
}
export interface IExchangeRateRepository extends IRepository<ExchangeRateAggregate> {
  findBySpecification(spec: ISpecification<ExchangeRateAggregate>): Promise<ExchangeRateAggregate[]>;
}
export interface IReconciliationRepository extends IRepository<ReconciliationAggregate> {
  findBySpecification(spec: ISpecification<ReconciliationAggregate>): Promise<ReconciliationAggregate[]>;
}
