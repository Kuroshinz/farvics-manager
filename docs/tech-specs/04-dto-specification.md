# DTO Specification

## `CreateAccountDTO`
```typescript
{
  name: string; // Min: 1, Max: 100
  type: 'CHECKING' | 'SAVINGS' | 'CREDIT';
  currencyCode: string; // Length: 3, ISO 4217
}
```

## `AccountDTO`
```typescript
{
  id: string; // UUID
  name: string;
  type: string;
  balanceCents: number;
  currencyCode: string;
  version: number;
}
```

## `ErrorDTO`
```typescript
{
  code: string; // e.g., 'VALIDATION_ERROR', 'CONCURRENCY_ERROR'
  message: string;
  details?: Record<string, string[]>; // Field-level errors
}
```
