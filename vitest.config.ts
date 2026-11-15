import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';
const path = (s: string) => fileURLToPath(new URL(s, import.meta.url));
export default defineConfig({
  resolve: { alias: {
    '@gitcourse/contracts': path('./packages/contracts/src/index.ts'),
    '@gitcourse/engine': path('./packages/git-engine/src/index.ts'),
    '@gitcourse/content': path('./packages/course-content/src/index.ts'),
  } },
  test: { include: ['packages/**/*.test.ts', 'services/**/*.test.ts', 'apps/**/*.test.{ts,tsx}'], environment: 'node', testTimeout: 15000 },
});
