import { IBudgetRepository } from '../../domain/repositories';
import { BudgetAggregate } from '../../domain/aggregates';
import { ISpecification } from '../../../../shared/core/Specification';

export class SupabaseBudgetRepository implements IBudgetRepository {
  constructor(private readonly supabaseClient: any) {}

  async findById(id: string): Promise<BudgetAggregate | null> { return null; }
  async findAll(): Promise<BudgetAggregate[]> { return []; }
  async save(entity: BudgetAggregate, expectedVersion?: number): Promise<void> {}
  async delete(entity: BudgetAggregate): Promise<void> {}
  async findBySpecification(spec: ISpecification<BudgetAggregate>): Promise<BudgetAggregate[]> { return []; }
}
