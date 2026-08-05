# UI Specification

## Layout: `DashboardShell`
- **Sidebar**: Accounts summary, Navigation links (Dashboard, Transactions, Settings).
- **Top Bar**: Global search, User profile dropdown, Theme toggle.

## Form: `CreateAccountForm`
- **Inputs**: `name` (Text), `type` (Select), `currencyCode` (Select, Default: 'USD').
- **Submit**: Triggers `createAccount` action. Disable button on pending.
- **Error State**: Inline red text below inputs for field errors. Toast for global errors.
- **Success State**: Toast notification, closes modal, invalidates `accounts` query cache.

## Component: `TransactionTable`
- **Pagination**: Keyset (Cursor) based, 50 rows per page.
- **Columns**: Date, Description, Category, Amount (Formatted via Money formatting utility), Status.
