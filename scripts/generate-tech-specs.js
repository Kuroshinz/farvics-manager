const fs = require('fs');
const path = require('path');

const dir = path.join('d:', 'ManagerMn', 'docs', 'tech-specs');

const files = {
  '01-database-specification.md': `# Database Specification

## Table: \`users\`
- **Purpose**: Core identity and tenant root.
- **Columns**: 
  - \`id\` (UUID, PK, Default: gen_random_uuid())
  - \`email\` (VARCHAR(255), Unique, Not Null)
  - \`created_at\` (TIMESTAMPTZ, Not Null, Default: now())
  - \`updated_at\` (TIMESTAMPTZ, Not Null, Default: now())
  - \`version\` (INT, Not Null, Default: 1)
- **Indexes**: \`idx_users_email\`
- **RLS Policy**: \`auth.uid() = id\`

## Table: \`accounts\`
- **Purpose**: Financial ledger accounts (checking, savings, etc).
- **Columns**:
  - \`id\` (UUID, PK, Default: gen_random_uuid())
  - \`user_id\` (UUID, FK -> users.id, Not Null)
  - \`name\` (VARCHAR(100), Not Null)
  - \`type\` (VARCHAR(50), Not Null) - Check: \`CHECKING\`, \`SAVINGS\`, \`CREDIT\`
  - \`currency_code\` (VARCHAR(3), Not Null) - Check: length = 3
  - \`balance_cents\` (BIGINT, Not Null, Default: 0)
  - \`created_at\` (TIMESTAMPTZ, Not Null, Default: now())
  - \`updated_at\` (TIMESTAMPTZ, Not Null, Default: now())
  - \`version\` (INT, Not Null, Default: 1)
- **Indexes**: \`idx_accounts_user_id\`
- **RLS Policy**: \`auth.uid() = user_id\`

## Table: \`transactions\`
- **Purpose**: Immutable financial ledger entries.
- **Columns**:
  - \`id\` (UUID, PK)
  - \`account_id\` (UUID, FK -> accounts.id, Not Null)
  - \`user_id\` (UUID, FK -> users.id, Not Null)
  - \`amount_cents\` (BIGINT, Not Null)
  - \`type\` (VARCHAR(20), Not Null) - Check: \`CREDIT\`, \`DEBIT\`
  - \`status\` (VARCHAR(20), Not Null) - Check: \`PENDING\`, \`CLEARED\`
  - \`date\` (DATE, Not Null)
  - \`created_at\` (TIMESTAMPTZ, Not Null)
  - \`updated_at\` (TIMESTAMPTZ, Not Null)
  - \`version\` (INT, Not Null, Default: 1)
- **Indexes**: \`idx_transactions_account_id\`, \`idx_transactions_date\`
- **RLS Policy**: \`auth.uid() = user_id\`

## Table: \`outbox_events\`
- **Purpose**: Transactional outbox for EDA.
- **Columns**:
  - \`id\` (UUID, PK)
  - \`aggregate_type\` (VARCHAR(50), Not Null)
  - \`aggregate_id\` (UUID, Not Null)
  - \`event_type\` (VARCHAR(100), Not Null)
  - \`payload\` (JSONB, Not Null)
  - \`metadata\` (JSONB, Not Null)
  - \`created_at\` (TIMESTAMPTZ, Not Null)
  - \`processed_at\` (TIMESTAMPTZ, Null)
`,

  '02-entity-specification.md': `# Entity Specification

## Aggregate: \`Account\`
- **Properties**: \`id\`, \`userId\`, \`name\`, \`type\`, \`currencyCode\`, \`balanceCents\`, \`version\`, \`updatedAt\`
- **Value Objects**: \`Money(balanceCents, currencyCode)\`
- **Invariants**: Balance must accurately reflect sum of cleared transactions. Currency code must be ISO 4217.
- **Concurrency**: Optimistic locking via \`version\`.

## Aggregate: \`Transaction\`
- **Properties**: \`id\`, \`accountId\`, \`userId\`, \`amountCents\`, \`type\`, \`status\`, \`date\`, \`version\`
- **Invariants**: Amount cannot be zero. Account must belong to the user.
- **Lifecycle**: \`PENDING\` -> \`CLEARED\` -> (Terminal). \`DELETED\` (Soft delete).
`,

  '03-api-specification.md': `# API Specification

## Action: \`createAccount\`
- **Route**: Server Action \`@modules/ledger/presentation/actions/createAccount\`
- **Auth**: Required (Valid Session).
- **Input DTO**: \`CreateAccountDTO\`
- **Output DTO**: \`{ success: true, data: AccountDTO }\` | \`{ success: false, error: ErrorDTO }\`
- **Errors**: \`VALIDATION_ERROR\`, \`UNAUTHORIZED\`, \`LIMIT_EXCEEDED\` (Max 20 accounts).
- **Events Published**: \`AccountCreated\`

## Action: \`createTransaction\`
- **Input DTO**: \`CreateTransactionDTO\`
- **Errors**: \`ACCOUNT_NOT_FOUND\`, \`CONCURRENCY_ERROR\`.
`,

  '04-dto-specification.md': `# DTO Specification

## \`CreateAccountDTO\`
\`\`\`typescript
{
  name: string; // Min: 1, Max: 100
  type: 'CHECKING' | 'SAVINGS' | 'CREDIT';
  currencyCode: string; // Length: 3, ISO 4217
}
\`\`\`

## \`AccountDTO\`
\`\`\`typescript
{
  id: string; // UUID
  name: string;
  type: string;
  balanceCents: number;
  currencyCode: string;
  version: number;
}
\`\`\`

## \`ErrorDTO\`
\`\`\`typescript
{
  code: string; // e.g., 'VALIDATION_ERROR', 'CONCURRENCY_ERROR'
  message: string;
  details?: Record<string, string[]>; // Field-level errors
}
\`\`\`
`,

  '05-repository-contracts.md': `# Repository Contracts

## \`IAccountRepository\`
\`\`\`typescript
interface IAccountRepository {
  findById(id: string): Promise<Account | null>;
  findByUserId(userId: string): Promise<Account[]>;
  save(account: Account): Promise<void>; // Throws ConcurrencyException
  delete(id: string, version: number): Promise<void>; // Throws ConcurrencyException
}
\`\`\`

## \`ITransactionRepository\`
\`\`\`typescript
interface ITransactionRepository {
  findById(id: string): Promise<Transaction | null>;
  save(transaction: Transaction): Promise<void>; // Writes to outbox_events in same DB TX
}
\`\`\`
`,

  '06-event-payload-specification.md': `# Event Payload Specification

## \`AccountCreated\`
\`\`\`typescript
{
  accountId: string;
  userId: string;
  currencyCode: string;
  initialBalanceCents: number;
}
\`\`\`
- **Metadata Required**: \`correlationId\`, \`causationId\`, \`hopCount\` (integer, starting at 0), \`actorId\`.

## \`TransactionCreated\`
\`\`\`typescript
{
  transactionId: string;
  accountId: string;
  amountCents: number;
  type: 'CREDIT' | 'DEBIT';
  status: 'PENDING' | 'CLEARED';
}
\`\`\`
`,

  '07-permission-matrix.md': `# Permission Matrix

| Resource | Action | Guest | User (Owner) | Admin | System |
| :--- | :--- | :--- | :--- | :--- | :--- |
| \`Account\` | Create | Deny | Allow | Deny | Deny |
| \`Account\` | Read | Deny | Allow (If owner) | Allow | Allow |
| \`Account\` | Update | Deny | Allow (If owner) | Deny | Allow |
| \`Account\` | Delete | Deny | Allow (If owner, Balance=0) | Deny | Deny |
| \`Transaction\` | Create | Deny | Allow (If owner) | Deny | Allow |
`,

  '08-ui-specification.md': `# UI Specification

## Layout: \`DashboardShell\`
- **Sidebar**: Accounts summary, Navigation links (Dashboard, Transactions, Settings).
- **Top Bar**: Global search, User profile dropdown, Theme toggle.

## Form: \`CreateAccountForm\`
- **Inputs**: \`name\` (Text), \`type\` (Select), \`currencyCode\` (Select, Default: 'USD').
- **Submit**: Triggers \`createAccount\` action. Disable button on pending.
- **Error State**: Inline red text below inputs for field errors. Toast for global errors.
- **Success State**: Toast notification, closes modal, invalidates \`accounts\` query cache.

## Component: \`TransactionTable\`
- **Pagination**: Keyset (Cursor) based, 50 rows per page.
- **Columns**: Date, Description, Category, Amount (Formatted via Money formatting utility), Status.
`,

  '09-validation-library.md': `# Validation Library (Zod)

\`\`\`typescript
import { z } from 'zod';

export const MoneyValidator = z.number().int().min(-10000000000).max(10000000000);
export const CurrencyValidator = z.string().length(3).regex(/^[A-Z]{3}$/);
export const UUIDValidator = z.string().uuid();
export const AccountTypeValidator = z.enum(['CHECKING', 'SAVINGS', 'CREDIT']);
export const PaginationValidator = z.object({
  cursor: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(50)
});
\`\`\`
`,

  '10-configuration-specification.md': `# Configuration Specification

## \`.env.example\`
\`\`\`env
# Supabase (Database & Auth)
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-key" # Server-only

# App Config
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"

# Feature Flags
NEXT_PUBLIC_ENABLE_AI_INSIGHTS="false"
\`\`\`

## Configuration Strategy
- **Development**: Local Supabase instance via Docker (\`npx supabase start\`).
- **Production**: Hosted Supabase. Vercel environment variables.
`
};

for (const [filename, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(dir, filename), content);
}
console.log('Successfully generated 10 implementation blueprints (Tech Specs).');
