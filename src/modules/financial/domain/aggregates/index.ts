import { IDomainEvent } from '../../../../shared/core/Events';

export abstract class AggregateRoot<TSnapshot> {
  private _domainEvents: IDomainEvent[] = [];
  public version: number = 0;

  get domainEvents(): ReadonlyArray<IDomainEvent> {
    return this._domainEvents;
  }

  protected addDomainEvent(event: IDomainEvent): void {
    this._domainEvents.push(event);
  }

  public clearEvents(): void {
    this._domainEvents = [];
  }

  abstract createSnapshot(): TSnapshot;
  abstract restoreFromSnapshot(snapshot: TSnapshot): void;
}

export class AccountAggregate extends AggregateRoot<any> {
  createSnapshot() { return {}; }
  restoreFromSnapshot(snapshot: any) {}
}
export class JournalAggregate extends AggregateRoot<any> {
  createSnapshot() { return {}; }
  restoreFromSnapshot(snapshot: any) {}
}
export class BudgetAggregate extends AggregateRoot<any> {
  createSnapshot() { return {}; }
  restoreFromSnapshot(snapshot: any) {}
}
export class CategoryAggregate extends AggregateRoot<any> {
  createSnapshot() { return {}; }
  restoreFromSnapshot(snapshot: any) {}
}
export class GoalAggregate extends AggregateRoot<any> {
  createSnapshot() { return {}; }
  restoreFromSnapshot(snapshot: any) {}
}
export class RecurringTransactionAggregate extends AggregateRoot<any> {
  createSnapshot() { return {}; }
  restoreFromSnapshot(snapshot: any) {}
}
export class ReconciliationAggregate extends AggregateRoot<any> {
  createSnapshot() { return {}; }
  restoreFromSnapshot(snapshot: any) {}
}
export class ExchangeRateAggregate extends AggregateRoot<any> {
  createSnapshot() { return {}; }
  restoreFromSnapshot(snapshot: any) {}
}
