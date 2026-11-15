import { defineConfig, devices } from '@playwright/test';
import { resolve } from 'node:path';
import { existsSync } from 'node:fs';

const databasePath = resolve('.tmp/e2e.sqlite');
const chromium = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE
  ?? (existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined);

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  workers: 1,
  timeout: 45_000,
  expect: { timeout: 10_000 },
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    ...devices['Desktop Chrome'],
    launchOptions: chromium ? { executablePath: chromium } : {},
  },
  webServer: [
    {
      command: 'node tests/reset-db.mjs && node --experimental-strip-types services/progress-api/src/dev-server.ts',
      url: 'http://127.0.0.1:8788/v1/config',
      env: { PORT: '8788', DATABASE_PATH: databasePath, NODE_ENV: 'test' },
      reuseExistingServer: false,
      timeout: 60_000,
    },
    {
      command: 'node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 4173 --strictPort',
      url: 'http://127.0.0.1:4173',
      env: { API_PROXY_TARGET: 'http://127.0.0.1:8788', PUBLIC_BASE_PATH: '/' },
      reuseExistingServer: false,
      timeout: 60_000,
    },
  ],
});
