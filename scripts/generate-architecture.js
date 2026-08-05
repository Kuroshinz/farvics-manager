const fs = require('fs');
const path = require('path');

const dir = path.join('d:', 'ManagerMn', 'docs', 'architecture');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const files = {
  '01-architecture-design-document.md': `# AURA.MONEY - Architecture Design Document (ADD)

## 1. Vision
Build a long-term AI Financial Platform supporting millions of users, multiple organizations, AI services, automation, analytics, bank integrations, and future ecosystem expansion.

## 2. Engineering Principles
- Platform First
- Strict Boundaries (Hexagonal & Clean Architecture)
- Replaceable Infrastructure
- At-least-once Event Delivery

## 3. Architecture Style
- **Modular Monolith**: Single deployment, strict internal module boundaries.
- **Domain Driven Design (DDD)**: Business logic is the core, infrastructure is peripheral.
- **CQRS (Light)**: Separation of commands (mutations) and queries (reads).
- **Event Driven Architecture**: Transactional Outbox pattern for asynchronous side-effects.

## 4. Dependency Rules
\`Presentation -> Application -> Domain <- Infrastructure\`
Domain never depends on Infrastructure.

## 5. Technology Stack
- **Frontend**: Next.js (App Router), React, Tailwind, shadcn/ui, Zustand, TanStack Query
- **Backend/DB**: Supabase (PostgreSQL), Edge Functions
- **Realtime**: Supabase Realtime
- **Charts**: Apache ECharts

## 6. Security & Performance
- **Security**: Row Level Security (RLS) per tenant/user.
- **Performance**: Edge caching, optimized Projections (Read Models), DB Indexing.
`,

  '02-domain-model-specification.md': `# AURA.MONEY - Domain Model Specification (DMS)

## 1. Ledger Context
- **Purpose**: Core accounting engine.
- **Aggregate Roots**: \`Account\`, \`Transaction\`
- **Entities**: \`Category\`
- **Value Objects**: \`Money\`, \`Currency\`, \`ExchangeRate\`
- **Events**: \`TransactionCreated\`, \`AccountCreated\`

## 2. Automation Context
- **Purpose**: Rule-based event processing.
- **Aggregate Roots**: \`Rule\`
- **Value Objects**: \`Condition\`, \`Action\`
- **Events**: \`AutomationExecuted\`

## 3. Identity Context
- **Purpose**: User and organization management.
- **Aggregate Roots**: \`User\`, \`Organization\`
- **Events**: \`UserRegistered\`, \`OrganizationCreated\`
`,

  '03-engineering-constitution.md': `# AURA.MONEY - Engineering Constitution

## 1. Coding Standards
- Strict TypeScript (no \`any\`).
- Functional core, imperative shell.

## 2. Dependency Rules
- Modules cannot import from other modules' \`infrastructure\` or \`presentation\` layers.
- Allowed: \`import { IAccountRepository } from '@modules/ledger/domain'\`

## 3. Testing Rules
- 100% coverage on \`domain\` and \`application\` layers.
- Integration tests required for all \`infrastructure\` adapters.

## 4. Git Workflow
- Conventional Commits (\`feat:\`, \`fix:\`, \`chore:\`).
- Branch strategy: \`feature/*\`, \`bugfix/*\`.
- No direct commits to \`main\`.
`,

  '04-architecture-decision-records.md': `# AURA.MONEY - Architecture Decision Records (ADR)

## ADR 001: Modular Monolith vs Microservices
**Decision**: Modular Monolith.
**Reasoning**: Microservices introduce distributed transaction complexity. We enforce boundaries internally so we can extract later if needed.

## ADR 002: Transactional Outbox for Events
**Decision**: Use Transactional Outbox.
**Reasoning**: Prevents dual-write failures. DB transaction guarantees event is persisted.
`,

  '05-platform-capability-map.md': `# AURA.MONEY - Platform Capability Map

## 1. Event Bus
- **Owner**: Platform Team
- **Purpose**: Dispatch outbox events to adapters.
- **Consumers**: Automation, AI, Notifications.

## 2. Feature Flags
- **Owner**: Platform Team
- **Purpose**: Phased rollouts, A/B testing.

## 3. Observability
- **Owner**: Platform Team
- **Purpose**: Logging, tracing, metrics.
`,

  '06-event-catalog.md': `# AURA.MONEY - Event Catalog

## 1. \`TransactionCreated\`
- **Aggregate**: \`Transaction\`
- **Payload**: \`{ transactionId, accountId, amount, currency, categoryId }\`
- **Subscribers**: Automation, Analytics, AIInsight

## 2. \`BudgetExceeded\`
- **Aggregate**: \`Budget\`
- **Payload**: \`{ budgetId, categoryId, limit, spent }\`
- **Subscribers**: Notifications
`,

  '07-command-catalog.md': `# AURA.MONEY - Command Catalog

## 1. \`CreateTransactionCommand\`
- **Validation**: Amount != 0, valid AccountId.
- **Handler**: \`CreateTransactionUseCase\`
- **Generates**: \`TransactionCreated\`

## 2. \`TransferFundsCommand\`
- **Validation**: Sufficient balance, matching currencies (or fx rate provided).
- **Generates**: \`TransferCompleted\`
`,

  '08-query-catalog.md': `# AURA.MONEY - Query Catalog

## 1. \`GetAccountBalanceQuery\`
- **Read Model**: \`AccountBalanceProjection\`
- **Caching**: 5 minutes (invalidated on \`TransactionCreated\`).

## 2. \`ListTransactionsQuery\`
- **Pagination**: Keyset/Cursor based.
- **Sorting**: Date DESC.
`,

  '09-projection-catalog.md': `# AURA.MONEY - Projection Catalog

## 1. Cash Flow Projection
- **Purpose**: Dashboard charts.
- **Updates**: Asynchronously updated by \`TransactionCreated\` and \`TransactionDeleted\` events.

## 2. Monthly Summary Projection
- **Purpose**: Fast rendering of month-over-month comparisons.
`,

  '10-plugin-system-specification.md': `# AURA.MONEY - Plugin System Specification

## 1. Architecture
Plugins are dynamic modules loaded at runtime or compile-time that implement \`IPlugin\`.

## 2. Capabilities
- Register new UI routes.
- Subscribe to Domain Events.
- Register new Commands/Queries.
- Inject Custom Widgets into Dashboards.

## 3. Lifecycle
\`Install\` -> \`Enable\` -> (Execute) -> \`Disable\` -> \`Remove\`
`
};

for (const [filename, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(dir, filename), content);
}
console.log('Successfully generated 10 architecture documents.');
