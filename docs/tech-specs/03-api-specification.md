# API Specification

## Action: `createAccount`
- **Route**: Server Action `@modules/ledger/presentation/actions/createAccount`
- **Auth**: Required (Valid Session).
- **Input DTO**: `CreateAccountDTO`
- **Output DTO**: `{ success: true, data: AccountDTO }` | `{ success: false, error: ErrorDTO }`
- **Errors**: `VALIDATION_ERROR`, `UNAUTHORIZED`, `LIMIT_EXCEEDED` (Max 20 accounts).
- **Events Published**: `AccountCreated`

## Action: `createTransaction`
- **Input DTO**: `CreateTransactionDTO`
- **Errors**: `ACCOUNT_NOT_FOUND`, `CONCURRENCY_ERROR`.
