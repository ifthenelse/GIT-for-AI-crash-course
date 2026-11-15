import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

const path = (value: string) => fileURLToPath(new URL(value, import.meta.url));
export default defineConfig({
  root: 'apps/web',
  base: process.env.PUBLIC_BASE_PATH || '/',
  plugins: [react()],
  resolve: { alias: {
    '@gitcourse/contracts': path('./packages/contracts/src/index.ts'),
    '@gitcourse/engine': path('./packages/git-engine/src/index.ts'),
    '@gitcourse/content': path('./packages/course-content/src/index.ts'),
  } },
  server: { proxy: { '/v1': process.env.API_PROXY_TARGET || 'http://127.0.0.1:8787', '/auth': process.env.API_PROXY_TARGET || 'http://127.0.0.1:8787' } },
  build: { outDir: '../../dist', emptyOutDir: true },
});
