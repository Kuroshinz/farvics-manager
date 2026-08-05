import { IRecurringTransactionRepository } from '../../domain/repositories';
import { RecurringTransactionAggregate } from '../../domain/aggregates';
import { ISpecification } from '../../../../shared/core/Specification';

export class SupabaseRecurringTransactionRepository implements IRecurringTransactionRepository {
  constructor(private readonly supabaseClient: any) {}

  async findById(id: string): Promise<RecurringTransactionAggregate | null> { return null; }
  async findAll(): Promise<RecurringTransactionAggregate[]> { return []; }
  async save(entity: RecurringTransactionAggregate, expectedVersion?: number): Promise<void> {}
  async delete(entity: RecurringTransactionAggregate): Promise<void> {}
  async findBySpecification(spec: ISpecification<RecurringTransactionAggregate>): Promise<RecurringTransactionAggregate[]> { return []; }
}
