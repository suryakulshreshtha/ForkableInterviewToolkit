import { defineConfig } from '@playwright/test';

/**
 * API config -- no browser needed, so no `projects` with devices.
 * Run with: npm run test:api
 */
export default defineConfig({
  testDir: './examples/api-testing',
  use: {
    baseURL: 'https://reqres.in/api',
    extraHTTPHeaders: { Accept: 'application/json' },
  },
  reporter: [['list']],
});
