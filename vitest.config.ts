import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        'src/modules/**/domain/**/*.ts': {
          lines: 95,
          functions: 95,
          branches: 95,
          statements: 95
        },
        'src/modules/**/application/**/*.ts': {
          lines: 90,
          functions: 90,
          branches: 90,
          statements: 90
        },
        'src/modules/**/infrastructure/**/*.ts': {
          lines: 80,
          functions: 80,
          branches: 80,
          statements: 80
        }
      }
    }
  }
});
