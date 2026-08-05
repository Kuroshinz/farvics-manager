import { IDomainEvent } from '../../../../shared/core/Events';

abstract class FinancialBaseEvent implements IDomainEvent {
  constructor(
    public readonly eventId: string,
    public readonly aggregateId: string,
    public readonly aggregateType: string,
    public readonly aggregateVersion: number,
    public readonly eventType: string,
    public readonly occurredAt: Date,
    public readonly actor: string,
    public readonly correlationId: string,
    public readonly causationId: string,
    public readonly schemaVersion: string,
    public readonly metadata: Record<string, unknown>,
    public readonly tenantId?: string
  ) {}
}

export class JournalCreated extends FinancialBaseEvent {}
export class JournalPosted extends FinancialBaseEvent {}
export class JournalReversed extends FinancialBaseEvent {}
export class BudgetCreated extends FinancialBaseEvent {}
export class BudgetUpdated extends FinancialBaseEvent {}
export class BudgetArchived extends FinancialBaseEvent {}
export class CategoryCreated extends FinancialBaseEvent {}
export class ExchangeRateCreated extends FinancialBaseEvent {}
export class StatementReconciled extends FinancialBaseEvent {}
