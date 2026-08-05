# Event Payload Specification

## `AccountCreated`
```typescript
{
  accountId: string;
  userId: string;
  currencyCode: string;
  initialBalanceCents: number;
}
```
- **Metadata Required**: `correlationId`, `causationId`, `hopCount` (integer, starting at 0), `actorId`.

## `TransactionCreated`
```typescript
{
  transactionId: string;
  accountId: string;
  amountCents: number;
  type: 'CREDIT' | 'DEBIT';
  status: 'PENDING' | 'CLEARED';
}
```
