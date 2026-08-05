import { ICategoryRepository } from '../../domain/repositories';
import { CategoryAggregate } from '../../domain/aggregates';
import { ISpecification } from '../../../../shared/core/Specification';

export class SupabaseCategoryRepository implements ICategoryRepository {
  constructor(private readonly supabaseClient: any) {}

  async findById(id: string): Promise<CategoryAggregate | null> { return null; }
  async findAll(): Promise<CategoryAggregate[]> { return []; }
  async save(entity: CategoryAggregate, expectedVersion?: number): Promise<void> {}
  async delete(entity: CategoryAggregate): Promise<void> {}
  async findBySpecification(spec: ISpecification<CategoryAggregate>): Promise<CategoryAggregate[]> { return []; }
}
