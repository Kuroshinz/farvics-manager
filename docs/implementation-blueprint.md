# Farvics Manager Phase 1 - Implementation Blueprint

## 1. Repository Tree

```
aura-money/
├── .github/                  # CI/CD pipelines
├── docs/                     # Architecture, Specs, Blueprints
├── public/                   # Static assets
├── scripts/                  # Code generation and dev utilities
├── supabase/
│   ├── migrations/           # SQL migration files
│   └── functions/            # Edge functions (e.g., outbox-dispatcher)
├── tests/                    # E2E and global integration tests
├── src/
│   ├── app/                  # Next.js App Router (Composition Root)
│   │   ├── (auth)/           # Login/Register pages
│   │   ├── (dashboard)/      # Shell and authenticated pages
│   │   └── api/              # Global API routes
│   ├── modules/              # Business Domains
│   │   └── ledger/
│   │       ├── domain/       # Entities, Value Objects, Domain Events
│   │       ├── application/  # Use Cases, DTOs
│   │       ├── infrastructure/# DB Repositories, Adapters
│   │       └── presentation/ # UI Components, Server Actions
│   ├── platform/             # Infrastructure primitives
│   │   ├── auth/             # Session management
│   │   ├── events/           # Outbox publisher interface
│   │   ├── logger/           # Structured logging
│   │   └── config/           # Environment validation (Zod)
│   └── shared/               # Global UI and Utils
│       ├── components/       # shadcn/ui components
│       ├── styles/           # Tailwind and globals.css
│       ├── utils/            # formatting, standard validators
│       └── hooks/            # Generic React hooks
├── .env.example
├── eslint.config.mjs
├── next.config.mjs
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## 2. File Responsibilities (Core Sample)

### `src/modules/ledger/domain/Account.ts`
- **Purpose**: Defines Account Aggregate Root and state transitions.
- **Dependencies**: None (Core Domain).
- **Exports**: `Account` class/type.
- **Stable**: Yes. Expected to evolve slowly.

### `src/modules/ledger/infrastructure/SupabaseAccountRepository.ts`
- **Purpose**: Implements `IAccountRepository` via Supabase SDK.
- **Dependencies**: `IAccountRepository`, Supabase Client.
- **Stable**: Adapts to DB changes.

### `supabase/migrations/0001_initial_schema.sql`
- **Purpose**: Defines users, accounts, transactions, outbox_events tables.
- **Dependencies**: None.
- **Stable**: Immutable once applied.

## 3. Module Dependency Matrix

| Module | Allowed Imports | Forbidden Imports |
| :--- | :--- | :--- |
| `ledger/domain` | `shared/utils` | `ledger/infrastructure`, `platform/*` |
| `ledger/application` | `ledger/domain`, `shared/utils` | `ledger/presentation`, `app/*` |
| `ledger/presentation` | `ledger/application`, `shared/components`| `ledger/infrastructure` |
| `app/*` (Composition) | `modules/*`, `platform/*` | None (Roots wire everything) |

*Circular Dependency Prevention*: ESLint `import/no-cycle` strictly enforced.

## 4. Build Order

1. **Config Files** (`package.json`, `tsconfig.json`, `eslint.config.mjs`): Establishes project environment.
2. **Platform & Validation** (`shared/utils/validators.ts`, `platform/config/env.ts`): Required by everything else.
3. **Database Migrations** (`0001_initial_schema.sql`): Source of truth for backend infrastructure.
4. **Domain & Application** (`ledger/domain/*`, `ledger/application/*`): Core business logic.
5. **Infrastructure** (`ledger/infrastructure/*`): Implements application interfaces.
6. **Presentation** (`ledger/presentation/*`): Wires UI to application.
7. **App Router** (`src/app/*`): Mounts presentation components to web routes.

## 5. Implementation Waves

- **Wave 1 (Bootstrap)**: Next.js scaffold, Tailwind, Supabase CLI init, ESLint boundary rules.
- **Wave 2 (Platform Foundation)**: DB migrations, `outbox_events` table, Zod validation library, Logger.
- **Wave 3 (Identity)**: Supabase Auth integration, `users` table trigger, Session middleware.
- **Wave 4 (Ledger Domain)**: Account/Transaction aggregates, DTOs, Repositories, Server Actions.
- **Wave 5 (UI & App Router)**: Dashboard Shell, Create Account Form, Transaction Table.
- **Wave 6 (Testing)**: E2E Playwright tests, Integration test execution.

## 6. Parallel Work Map
- **Parallelizable in Wave 4**: 
  - Engineer A: `ledger/domain` and `ledger/application` (TDD approach).
  - Engineer B: `ledger/infrastructure` (Supabase implementations using interfaces).
- **Merge Risks**: DTO contracts in `ledger/application`. Must be finalized and merged first before parallel split.

## 7. Verification Gates (Per Wave)
Every wave must pass the following before moving to the next:
1. `npm run build` (Compile & Type Check).
2. `npm run lint` (No warnings).
3. Unit/Integration Tests pass.
4. Manual Architecture Review (Check dependency boundaries).

## 8. Refactoring Policy
- No large-scale refactors allowed in Phase 1.
- Refactoring only permitted to fix bugs or reduce localized complexity without altering public API contracts.

## 9. File Creation Rules
- **Single Responsibility**: One class/component/function per file.
- **Typed Interfaces**: `any` is strictly prohibited.
- **Documentation**: JSDoc required for all exported interfaces and Server Actions.
- **No Dead Code**: Remove all unused imports.

