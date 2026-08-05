# Farvics Manager - Query Catalog

## 1. `GetAccountBalanceQuery`
- **Read Model**: `AccountBalanceProjection`
- **Caching**: 5 minutes (invalidated on `TransactionCreated`).

## 2. `ListTransactionsQuery`
- **Pagination**: Keyset/Cursor based.
- **Sorting**: Date DESC.

