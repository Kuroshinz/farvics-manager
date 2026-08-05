# Validation Library (Zod)

```typescript
import { z } from 'zod';

export const MoneyValidator = z.number().int().min(-10000000000).max(10000000000);
export const CurrencyValidator = z.string().length(3).regex(/^[A-Z]{3}$/);
export const UUIDValidator = z.string().uuid();
export const AccountTypeValidator = z.enum(['CHECKING', 'SAVINGS', 'CREDIT']);
export const PaginationValidator = z.object({
  cursor: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(50)
});
```
