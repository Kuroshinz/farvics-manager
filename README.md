# AURA.MONEY

AURA.MONEY is an enterprise-grade, AI-powered personal finance platform built for scalability, security, and long-term maintainability.

## Architecture Overview
This project strictly enforces a **Domain-Driven Modular Monolith** architecture:
- **Clean Architecture**: Dependencies point inward (`Presentation -> Application -> Domain <- Infrastructure`).
- **Transactional Outbox**: Event-driven architecture ensures dual-write safety.
- **Strict Boundaries**: ESLint automatically rejects illegal imports across domains and layers.

## Repository Structure
- `src/modules/*`: Independent business domains (e.g., `ledger`, `identity`).
- `src/platform/*`: Cross-cutting capabilities (Auth, Outbox Events, Config).
- `src/shared/*`: Global UI components (shadcn), Hooks, and Utility validators.
- `src/app/*`: Next.js composition root and public routing.
- `docs/*`: Technical specifications, architecture guidelines, and execution plans.

## Required Tooling
- Node.js (>=18.x)
- Docker (for local Supabase)
- Supabase CLI

## Local Development
1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Start local infrastructure: `npx supabase start`.
4. Start dev server: `npm run dev`.

## Documentation Index
- [Architecture Design Document](./docs/architecture/01-architecture-design-document.md)
- [Technical Specifications](./docs/tech-specs)
- [Execution Roadmap](./docs/execution-plan)
- [Implementation Blueprint](./docs/implementation-blueprint.md)