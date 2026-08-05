import { IReconciliationRepository } from '../../domain/repositories';
import { ReconciliationAggregate } from '../../domain/aggregates';
import { ISpecification } from '../../../../shared/core/Specification';

export class SupabaseReconciliationRepository implements IReconciliationRepository {
  constructor(private readonly supabaseClient: any) {}

  async findById(id: string): Promise<ReconciliationAggregate | null> { return null; }
  async findAll(): Promise<ReconciliationAggregate[]> { return []; }
  async save(entity: ReconciliationAggregate, expectedVersion?: number): Promise<void> {}
  async delete(entity: ReconciliationAggregate): Promise<void> {}
  async findBySpecification(spec: ISpecification<ReconciliationAggregate>): Promise<ReconciliationAggregate[]> { return []; }
}
