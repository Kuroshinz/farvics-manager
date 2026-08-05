# Financial Application Layer

## Purpose
The Financial Application Layer is responsible solely for orchestration. It translates external requests (DTOs) into domain operations using CQRS, strictly avoiding any business logic or financial calculations.

## Commands
Commands mutate state. Every command is handled by exactly one handler.
- `CreateJournalCommand`
- `PostJournalCommand`
- `ReverseJournalCommand`
- `CreateBudgetCommand`
- `UpdateBudgetCommand`
- `ArchiveBudgetCommand`
- `CreateCategoryCommand`
- `DeleteCategoryCommand`
- `CreateExchangeRateCommand`
- `ReconcileStatementCommand`

## Queries
Queries retrieve data without side effects.
- `GetJournalById`
- `GetLedger`
- `GetCashFlow`
- `GetBudgetSummary`
- `GetAccountBalance`
- `GetCategoryTree`
- `GetReconciliationStatus`

## DTO Flow
1. Client submits a `RequestDTO` (e.g. `CreateJournalRequest`).
2. The Request is mapped into an `ICommand` or `IQuery`.
3. Validation Pipeline intercepts and guarantees structure.
4. Handler uses Domain Models to process logic.
5. Handler maps Domain Models to `ResponseDTO`s before returning.
Domain aggregates are **never** returned directly.

## Pipeline Flow
Requests flow through the following `IPipelineBehavior` sequence:
`Request -> Logging -> Metrics -> Audit -> Validation -> Authorization -> Transaction -> Handler -> Event Publishing -> Response`

## Dependencies
Handlers and Application Services declare dependencies strictly on interfaces:
`Repositories`, `Domain Services`, `Policies`, `UnitOfWork`, `EventPublisher`, `Clock`, `IdGenerator`, `Logger`.
Infrastructure components (like Postgres or Prisma) are forbidden.
