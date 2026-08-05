# Entity Specification

## Aggregate: `Account`
- **Properties**: `id`, `userId`, `name`, `type`, `currencyCode`, `balanceCents`, `version`, `updatedAt`
- **Value Objects**: `Money(balanceCents, currencyCode)`
- **Invariants**: Balance must accurately reflect sum of cleared transactions. Currency code must be ISO 4217.
- **Concurrency**: Optimistic locking via `version`.

## Aggregate: `Transaction`
- **Properties**: `id`, `accountId`, `userId`, `amountCents`, `type`, `status`, `date`, `version`
- **Invariants**: Amount cannot be zero. Account must belong to the user.
- **Lifecycle**: `PENDING` -> `CLEARED` -> (Terminal). `DELETED` (Soft delete).
