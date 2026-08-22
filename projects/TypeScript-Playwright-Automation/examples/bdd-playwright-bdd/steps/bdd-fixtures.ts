import { test as base } from 'playwright-bdd';

import { makePracticePage, type MyFixtures } from '../../../framework/fixtures/definitions';
import { baseUrl } from '../../../framework/utils/config';

/**
 * BDD-flavoured `test`.
 *
 * playwright-bdd requires `createBdd()` to receive a `test` extended from ITS base
 * (it attaches metadata the generator needs). The setup logic is imported from the
 * framework, so steps get exactly the same `practicePage` the plain specs use.
 */
export const test = base.extend<MyFixtures>({
  appUrl: async ({}, use) => {
    await use(baseUrl());
  },

  practicePage: async ({ page, appUrl }, use) => {
    await use(await makePracticePage(page, appUrl));
  },
});

export { expect } from '@playwright/test';
