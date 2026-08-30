import { defineConfig, devices } from '@playwright/test';

import { baseUrl, isLiveTarget } from './framework/utils/config';

/**
 * Main config -- the framework suite only.
 *
 * `testDir` deliberately points at framework/tests so `examples/` never runs in the
 * default pass; BDD and API examples have their own configs. This mirrors the Python
 * project's `testpaths = framework/tests` in pytest.ini.
 */
export default defineConfig({
  testDir: './framework/tests',

  use: {
    baseURL: baseUrl(),
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  // Start the local fixture for the suite and stop it afterwards, so a run is
  // hermetic and needs no network. Skipped when BASE_URL points at the live
  // site, which is what `npm run test:live` does.
  webServer: isLiveTarget()
    ? undefined
    : {
        command: 'npx tsx fixtures/practice-app/server.ts',
        url: baseUrl(),
        reuseExistingServer: !process.env.CI,
        timeout: 30_000,
        stdout: 'ignore',
      },

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  timeout: 60_000,
  expect: { timeout: 10_000 },

  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
