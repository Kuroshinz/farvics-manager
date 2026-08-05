import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        statements: 85,
        branches: 85,
        functions: 85,
        lines: 85,
      }
    },
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
  },
});
