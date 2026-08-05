import { IGoalRepository } from '../../domain/repositories';
import { GoalAggregate } from '../../domain/aggregates';
import { ISpecification } from '../../../../shared/core/Specification';

export class SupabaseGoalRepository implements IGoalRepository {
  constructor(private readonly supabaseClient: any) {}

  async findById(id: string): Promise<GoalAggregate | null> { return null; }
  async findAll(): Promise<GoalAggregate[]> { return []; }
  async save(entity: GoalAggregate, expectedVersion?: number): Promise<void> {}
  async delete(entity: GoalAggregate): Promise<void> {}
  async findBySpecification(spec: ISpecification<GoalAggregate>): Promise<GoalAggregate[]> { return []; }
}
