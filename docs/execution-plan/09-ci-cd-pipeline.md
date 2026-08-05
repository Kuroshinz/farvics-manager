# CI/CD Pipeline

## Pipeline Stages (GitHub Actions)
1. **Lint & Type Check**: `eslint`, `tsc`, `prettier`.
2. **Unit Tests**: `vitest` execution.
3. **Integration Tests**: Spin up Supabase CLI in GitHub Actions, apply migrations, run DB tests.
4. **E2E Tests**: Playwright against ephemeral Vercel preview environments.
5. **Security Scan**: Snyk or dependabot vulnerability checks.
6. **Deploy**: Vercel handles staging (on PR) and production (on `main` merge).
