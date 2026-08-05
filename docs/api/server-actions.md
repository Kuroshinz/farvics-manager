# Server Actions API Ports

## Lifecycle
The application exposes its capabilities exclusively via Next.js Server Actions utilizing the `'use server'` directive. These actions act as pure I/O Ports bridging raw web requests (JSON DTOs) directly into the `IMediator` CQRS dispatcher.

## Security Model
1. **Validation Flow**: Every incoming DTO is rigorously asserted against structure and boundaries by the `ValidationExecutor` before Domain logic even spins up.
2. **Authorization Flow**: The `AuthorizationGuard` extracts JWT/Cookie definitions wrapped cleanly inside the `ActionContext`, executing RBAC checks prior to mediator dispatch.
3. **Idempotency Guard**: Utilizing `CommandId` and bounded `IdempotencyKey` strings, duplicate user clicks or repeated webhooks are trapped and safely ignored, returning 409 Conflict ProblemDetails.
4. **Rate Limiting**: Hard quotas apply to Anon vs Authenticated requests stopping abuse.

## Error Mapping
Raw errors are inherently dangerous if exposed. The `ProblemDetailsMapper` securely maps explicit `ResultError` boundaries to RFC-compliant HTTP Problem Detail outputs ensuring safe debugging without stack-trace leakage.

## CQRS Flow
The Action does absolutely zero business logic mapping:
```text
Request -> ActionExecutor -> Mediator -> Application Handler -> UnitOfWork -> DB + Outbox
```
Once DB commits, the Outbox catches the DomainEvents and hands them off synchronously to the Dispatcher. Projections update securely in the background. Server Actions await only the successful UoW Commit.
