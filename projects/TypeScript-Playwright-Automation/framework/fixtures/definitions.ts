import type { Page } from '@playwright/test';

import { AutomationPracticePage } from '../pages/AutomationPracticePage';

/**
 * Shared fixture building blocks.
 *
 * Why this file exists: the plain spec suite extends `test` from '@playwright/test',
 * while playwright-bdd requires a `test` extended from 'playwright-bdd'. Those two
 * base types aren't interchangeable, so instead of sharing a typed fixture *object*
 * (which fights the type system), we share the SETUP LOGIC and let each side do its
 * own three-line `.extend()`. Behaviour stays identical; only the base differs.
 */
export type MyFixtures = {
  appUrl: string;
  practicePage: AutomationPracticePage;
};

/** Build an AutomationPracticePage that has already navigated and is ready to use. */
export async function makePracticePage(
  page: Page,
  appUrl: string,
): Promise<AutomationPracticePage> {
  const po = new AutomationPracticePage(page);
  await po.open(appUrl);
  return po;
}
