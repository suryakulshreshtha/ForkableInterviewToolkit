import { defineConfig, devices } from '@playwright/test';

/**
 * Main config -- the framework suite only.
 *
 * `testDir` deliberately points at framework/tests so `examples/` never runs in the
 * default pass; BDD and API examples have their own configs. This mirrors the Python
 * project's `testpaths = framework/tests` in pytest.ini.
 */
export default defineConfig({
  testDir: './framework/tests',

  // Public practice page, published for automation practice.
  // See the repo README's responsible-use policy before pointing this elsewhere.
  use: {
    baseURL: process.env.BASE_URL ?? 'https://rahulshettyacademy.com/AutomationPractice/',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
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
