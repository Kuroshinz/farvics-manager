import { IAccountRepository } from '../../domain/repositories';
import { AccountAggregate } from '../../domain/aggregates';
import { ISpecification } from '../../../../shared/core/Specification';
import { AccountMapper } from '../mappers/AccountMapper';
import { SpecificationTranslator } from '../../../../shared/infrastructure/query/SpecificationTranslator';
import { SupabaseUnitOfWork } from '../../../../shared/infrastructure/uow/SupabaseUnitOfWork';

export class SupabaseAccountRepository implements IAccountRepository {
  constructor(
    private readonly supabaseClient: any,
    private readonly uow: SupabaseUnitOfWork
  ) {}

  async findById(id: string): Promise<AccountAggregate | null> { return null; }
  async findAll(): Promise<AccountAggregate[]> { return []; }

  async save(entity: AccountAggregate, expectedVersion?: number): Promise<void> {
    const payload = AccountMapper.toPersistence(entity);
    if (expectedVersion !== undefined) {
      this.uow.registerOperation({
        table: 'financial_accounts',
        action: 'update',
        payload: { ...payload, version: expectedVersion + 1 },
        match: { id: payload.id, version: expectedVersion }
      });
    } else {
      this.uow.registerOperation({
        table: 'financial_accounts',
        action: 'insert',
        payload
      });
    }
  }

  async delete(entity: AccountAggregate): Promise<void> {
    const snapshot: any = entity.createSnapshot();
    this.uow.registerOperation({
      table: 'financial_accounts',
      action: 'update',
      payload: { deleted_at: new Date().toISOString() },
      match: { id: snapshot.id }
    });
  }

  async findBySpecification(spec: ISpecification<AccountAggregate>): Promise<AccountAggregate[]> { return []; }
}
