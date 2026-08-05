const fs = require('fs');
const path = require('path');

const dir = path.join('d:', 'ManagerMn', 'docs', 'execution-plan');

const files = {
  '01-sprint-plan.md': `# Sprint Plan - Phase 1

## Sprint 1: Foundation & Identity (Weeks 1-2)
- **Goal**: Scaffold monorepo, database, and auth.
- **Tasks**:
  - \`TSK-101\`: Scaffold Next.js + Tailwind + shadcn/ui.
  - \`TSK-102\`: Initialize Supabase project & environment vars.
  - \`TSK-103\`: Implement \`users\` and \`outbox_events\` SQL migrations.
  - \`TSK-104\`: Implement Supabase Auth UI (Login/Register).
- **Exit Criteria**: Users can register, log in, and view a blank protected dashboard.

## Sprint 2: Core Ledger (Weeks 3-4)
- **Goal**: Accounts, Transactions, and Outbox dispatcher.
- **Tasks**:
  - \`TSK-201\`: Implement \`accounts\` and \`transactions\` SQL migrations (with RLS).
  - \`TSK-202\`: Implement Zod Validation Library.
  - \`TSK-203\`: Implement Account/Transaction Repositories and Server Actions.
  - \`TSK-204\`: Build \`CreateAccountForm\` and \`TransactionTable\`.
  - \`TSK-205\`: Deploy Outbox Dispatcher Edge Function.
- **Exit Criteria**: Users can create accounts and log transactions. Events are persisted to outbox.
`,

  '02-dependency-graph.md': `# Dependency Graph

\`\`\`mermaid
graph TD
    TSK-102[Supabase Init] --> TSK-103[Users & Outbox DB Migrations]
    TSK-103 --> TSK-104[Auth UI]
    TSK-101[Next.js Scaffold] --> TSK-104
    TSK-104 --> TSK-201[Ledger DB Migrations]
    TSK-201 --> TSK-203[Repositories & Actions]
    TSK-101 --> TSK-202[Zod Validation]
    TSK-202 --> TSK-203
    TSK-203 --> TSK-204[Ledger UI]
    TSK-203 --> TSK-205[Outbox Dispatcher]
\`\`\`

**Critical Path**: \`TSK-102 -> TSK-103 -> TSK-201 -> TSK-203 -> TSK-204\`
`,

  '03-development-order.md': `# Development Order

1. **Database & Migrations (\`TSK-103\`, \`TSK-201\`)**: The DB is the absolute source of truth. Repositories cannot be written or tested without the schema and RLS policies existing first.
2. **Shared Validation (\`TSK-202\`)**: DTOs and API endpoints depend on centralized Zod validators.
3. **Backend Repositories & Server Actions (\`TSK-203\`)**: Must be complete before UI can be wired up. Allows parallel frontend dev using mocks.
4. **UI Integration (\`TSK-104\`, \`TSK-204\`)**: Wired to the completed Server Actions.
5. **Background Workers (\`TSK-205\`)**: Can be developed entirely in parallel once the outbox table schema is finalized.
`,

  '04-definition-of-done.md': `# Definition of Done (DoD)

For a task to move to "DONE", it MUST satisfy:
- [ ] Implementation complete and matches Technical Spec precisely.
- [ ] Unit Tests passing (>90% coverage).
- [ ] Integration Tests passing against local Supabase.
- [ ] \`npm run lint\` passes (0 warnings).
- [ ] \`tsc --noEmit\` passes (0 type errors).
- [ ] Security Review passed (RLS policies manually verified).
- [ ] Code meets Accessibility (WCAG AA) standards (axe-core passes).
- [ ] Pull Request approved by at least 1 senior engineer.
`,

  '05-code-review-checklist.md': `# Code Review Checklist

- [ ] **Architecture**: Does this violate the Dependency Rule (e.g., UI importing DB drivers)?
- [ ] **DDD**: Are mutations occurring outside of Aggregate boundaries?
- [ ] **Security**: Is the user ID verified server-side on every mutation? Is RLS bypassed?
- [ ] **Testing**: Are edge cases covered? Are we mocking the DB correctly or using local integration tests?
- [ ] **Error Handling**: Are all exceptions mapped to standard \`ErrorDTO\` contracts?
- [ ] **Observability**: Are \`correlationId\` and \`causationId\` propagated correctly?
`,

  '06-branch-strategy.md': `# Branch Strategy

- **Git Flow**: Trunk-based development.
- **Main Branch**: \`main\` (Always deployable to Production).
- **Branch Naming**: \`{type}/{issue-number}-{short-description}\` (e.g., \`feat/TSK-201-ledger-migrations\`).
- **Commit Convention**: Conventional Commits (\`feat:\`, \`fix:\`, \`chore:\`, \`test:\`).
- **Merge Rules**: Squash and Merge. Require linear history. CI must pass. 1 Approval required.
- **Hotfix**: Branch off \`main\` as \`hotfix/...\`. Merge back to \`main\`.
`,

  '07-testing-matrix.md': `# Testing Matrix

| Feature | Unit | Integration (Local Supabase) | E2E (Playwright) |
| :--- | :--- | :--- | :--- |
| **Auth** | Utils | RLS Triggers | Login flow |
| **Accounts** | Repositories, Domain | RLS, Server Actions | Create Account flow |
| **Transactions** | Repositories, Val | Outbox insert, Actions | Create TX flow |
| **Outbox Dispatcher**| Payload formatting | Webhook trigger | Async event delivery |
`,

  '08-risk-register.md': `# Risk Register

| Risk | Probability | Impact | Mitigation |
| :--- | :--- | :--- | :--- |
| RLS Misconfiguration exposing data | Low | Critical | Mandatory peer review of all \`.sql\` files. E2E tests executing as cross-tenant users. |
| Server Action concurrent race condition | Medium | High | Optimistic locking (\`version\` column) mandated in Tech Spec. E2E concurrency tests. |
| Edge Function timeout on Outbox | Medium | Medium | DLQ implementation. Keep dispatcher logic strictly to routing (fast). |
`,

  '09-ci-cd-pipeline.md': `# CI/CD Pipeline

## Pipeline Stages (GitHub Actions)
1. **Lint & Type Check**: \`eslint\`, \`tsc\`, \`prettier\`.
2. **Unit Tests**: \`vitest\` execution.
3. **Integration Tests**: Spin up Supabase CLI in GitHub Actions, apply migrations, run DB tests.
4. **E2E Tests**: Playwright against ephemeral Vercel preview environments.
5. **Security Scan**: Snyk or dependabot vulnerability checks.
6. **Deploy**: Vercel handles staging (on PR) and production (on \`main\` merge).
`,

  '10-acceptance-criteria.md': `# Phase 1 Acceptance Criteria

1. **Authentication**: Users can register, log in, and receive a secure HTTP-only session cookie.
2. **Account Management**: A user can create an Account. The DB contains exactly 1 row in \`accounts\`, and 1 event in \`outbox_events\`.
3. **Transaction Management**: A user can create a Transaction. Optimistic locking prevents duplicate submissions within 50ms of each other.
4. **Performance**: All read queries return in < 200ms at the 95th percentile.
5. **Security**: A user attempting to query or mutate an Account belonging to a different user ID receives an empty array or \`UNAUTHORIZED\` error via RLS.
`
};

for (const [filename, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(dir, filename), content);
}
console.log('Successfully generated 10 execution plan documents.');
