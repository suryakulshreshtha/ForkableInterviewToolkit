import type { Page } from '@playwright/test';

/**
 * Shared behaviour for every Page Object.
 *
 * Design rule for this framework: Page Objects expose ACTIONS and STATE.
 * They never assert -- the test decides what is correct.
 */
export class BasePage {
  constructor(protected readonly page: Page) {}

  async open(path = ''): Promise<this> {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
    return this;
  }

  async title(): Promise<string> {
    return this.page.title();
  }

  async screenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: `test-results/${name}.png`, fullPage: true });
  }
}
