# AURA.MONEY - Engineering Constitution

## 1. Coding Standards
- Strict TypeScript (no `any`).
- Functional core, imperative shell.

## 2. Dependency Rules
- Modules cannot import from other modules' `infrastructure` or `presentation` layers.
- Allowed: `import { IAccountRepository } from '@modules/ledger/domain'`

## 3. Testing Rules
- 100% coverage on `domain` and `application` layers.
- Integration tests required for all `infrastructure` adapters.

## 4. Git Workflow
- Conventional Commits (`feat:`, `fix:`, `chore:`).
- Branch strategy: `feature/*`, `bugfix/*`.
- No direct commits to `main`.
