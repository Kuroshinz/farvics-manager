# Repository Contracts

## `IAccountRepository`
```typescript
interface IAccountRepository {
  findById(id: string): Promise<Account | null>;
  findByUserId(userId: string): Promise<Account[]>;
  save(account: Account): Promise<void>; // Throws ConcurrencyException
  delete(id: string, version: number): Promise<void>; // Throws ConcurrencyException
}
```

## `ITransactionRepository`
```typescript
interface ITransactionRepository {
  findById(id: string): Promise<Transaction | null>;
  save(transaction: Transaction): Promise<void>; // Writes to outbox_events in same DB TX
}
```
