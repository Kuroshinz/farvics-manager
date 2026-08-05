import { IJournalRepository } from '../../domain/repositories';
import { JournalAggregate } from '../../domain/aggregates';
import { ISpecification } from '../../../../shared/core/Specification';

export class SupabaseJournalRepository implements IJournalRepository {
  constructor(private readonly supabaseClient: any) {}

  async findById(id: string): Promise<JournalAggregate | null> { return null; }
  async findAll(): Promise<JournalAggregate[]> { return []; }
  async save(entity: JournalAggregate, expectedVersion?: number): Promise<void> {}
  async delete(entity: JournalAggregate): Promise<void> {}
  async findBySpecification(spec: ISpecification<JournalAggregate>): Promise<JournalAggregate[]> { return []; }
}
