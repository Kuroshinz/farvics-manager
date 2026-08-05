const fs = require('fs');

// 1. Update tsconfig.json
const tsconfigPath = './tsconfig.json';
const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
tsconfig.compilerOptions.paths = {
  '@/*': ['./src/*'],
  '@modules/*': ['./src/modules/*'],
  '@platform/*': ['./src/platform/*'],
  '@shared/*': ['./src/shared/*'],
  '@app/*': ['./src/app/*']
};
fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));

// 2. Update ESLint configuration (.eslintrc.json)
const eslintPath = './.eslintrc.json';
const eslintConfig = {
  extends: ['next/core-web-vitals'],
  overrides: [
    {
      files: ['src/modules/*/domain/**/*', 'src/modules/*/application/**/*'],
      rules: {
        'no-restricted-imports': ['error', {
          patterns: [
            { group: ['@modules/*/infrastructure/*'], message: 'Hexagonal Violation: Domain/Application cannot import Infrastructure.' },
            { group: ['@modules/*/presentation/*'], message: 'Hexagonal Violation: Domain/Application cannot import Presentation.' },
            { group: ['@app/*'], message: 'Dependency Violation: Modules cannot depend on the App composition root.' }
          ]
        }]
      }
    },
    {
      files: ['src/modules/*/infrastructure/**/*'],
      rules: {
        'no-restricted-imports': ['error', {
          patterns: [
            { group: ['@modules/*/presentation/*'], message: 'Hexagonal Violation: Infrastructure cannot import Presentation.' }
          ]
        }]
      }
    }
  ]
};
fs.writeFileSync(eslintPath, JSON.stringify(eslintConfig, null, 2));
if(fs.existsSync('./eslint.config.mjs')) fs.unlinkSync('./eslint.config.mjs'); // Remove default flat config if exists to use .eslintrc.json

// 3. Update next.config.mjs for security headers
const nextConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' }
        ]
      }
    ];
  }
};
export default nextConfig;`;
fs.writeFileSync('./next.config.mjs', nextConfig);

// 4. Update README.md
const readme = `# AURA.MONEY

AURA.MONEY is an enterprise-grade, AI-powered personal finance platform built for scalability, security, and long-term maintainability.

## Architecture Overview
This project strictly enforces a **Domain-Driven Modular Monolith** architecture:
- **Clean Architecture**: Dependencies point inward (\`Presentation -> Application -> Domain <- Infrastructure\`).
- **Transactional Outbox**: Event-driven architecture ensures dual-write safety.
- **Strict Boundaries**: ESLint automatically rejects illegal imports across domains and layers.

## Repository Structure
- \`src/modules/*\`: Independent business domains (e.g., \`ledger\`, \`identity\`).
- \`src/platform/*\`: Cross-cutting capabilities (Auth, Outbox Events, Config).
- \`src/shared/*\`: Global UI components (shadcn), Hooks, and Utility validators.
- \`src/app/*\`: Next.js composition root and public routing.
- \`docs/*\`: Technical specifications, architecture guidelines, and execution plans.

## Required Tooling
- Node.js (>=18.x)
- Docker (for local Supabase)
- Supabase CLI

## Local Development
1. Clone the repository.
2. Run \`npm install\` to install dependencies.
3. Start local infrastructure: \`npx supabase start\`.
4. Start dev server: \`npm run dev\`.

## Documentation Index
- [Architecture Design Document](./docs/architecture/01-architecture-design-document.md)
- [Technical Specifications](./docs/tech-specs)
- [Execution Roadmap](./docs/execution-plan)
- [Implementation Blueprint](./docs/implementation-blueprint.md)`;
fs.writeFileSync('./README.md', readme);

console.log('Hardening tasks completed.');
