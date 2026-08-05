import { IExchangeRateRepository } from '../../domain/repositories';
import { ExchangeRateAggregate } from '../../domain/aggregates';
import { ISpecification } from '../../../../shared/core/Specification';

export class SupabaseExchangeRateRepository implements IExchangeRateRepository {
  constructor(private readonly supabaseClient: any) {}

  async findById(id: string): Promise<ExchangeRateAggregate | null> { return null; }
  async findAll(): Promise<ExchangeRateAggregate[]> { return []; }
  async save(entity: ExchangeRateAggregate, expectedVersion?: number): Promise<void> {}
  async delete(entity: ExchangeRateAggregate): Promise<void> {}
  async findBySpecification(spec: ISpecification<ExchangeRateAggregate>): Promise<ExchangeRateAggregate[]> { return []; }
}
