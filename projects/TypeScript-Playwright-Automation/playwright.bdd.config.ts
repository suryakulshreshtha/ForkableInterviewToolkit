import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

/**
 * BDD config -- kept separate so `npm test` stays fast and focused.
 *
 * playwright-bdd generates real Playwright test files from the .feature files,
 * which means fixtures, parallelism, traces, and the HTML reporter all work
 * exactly as they do for a normal spec. Run with: npm run test:bdd
 */
const testDir = defineBddConfig({
  features: 'examples/bdd-playwright-bdd/features/**/*.feature',
  steps: 'examples/bdd-playwright-bdd/steps/**/*.ts',
  outputDir: '.features-gen',
});

export default defineConfig({
  testDir,
  use: {
    baseURL: process.env.BASE_URL ?? 'https://rahulshettyacademy.com/AutomationPractice/',
    trace: 'retain-on-failure',
  },
  reporter: [['list']],
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
